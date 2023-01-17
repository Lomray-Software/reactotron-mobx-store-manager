import EventManager from '@lomray/event-manager';
import { Events, Manager } from '@lomray/react-mobx-manager';
import _ from 'lodash';
import { runInAction, spy } from 'mobx';
import type { Reactotron } from 'reactotron-core-client';
import type { IReactotronCommand, IStateChanges } from './types';

export interface ICommandHandler {
  defaultSubscribe?: string | false;
}

enum Listeners {
  SPY = 'spy',
}

/**
 * Reactotron command handler
 */
class CommandHandler {
  /**
   * @protected
   */
  protected config: ICommandHandler = {
    defaultSubscribe: '*',
  };

  /**
   * @protected
   */
  protected reactotron: Reactotron;

  /**
   * Store global listeners
   * @protected
   */
  protected static listeners: Record<Listeners | string, () => void> = {};

  /**
   * @constructor
   */
  public constructor(reactotron: Reactotron, config: ICommandHandler = {}) {
    this.reactotron = reactotron;
    this.config = Object.assign(this.config, config);

    Object.values(CommandHandler.listeners).forEach((unsubscribe) => {
      unsubscribe();
    });
  }

  /**
   * Get context tree key
   * @protected
   */
  protected getContextKey(contextId: string, nestedKey?: string): string {
    if (contextId === 'root') {
      return contextId;
    }

    const { parentId } = Manager.get().getStoresRelations().get(contextId) ?? {};

    if (!parentId || parentId === 'root') {
      return `${parentId ?? 'root'}.${nestedKey ?? contextId}`;
    }

    return this.getContextKey(parentId, `${parentId}.${nestedKey ?? contextId}`);
  }

  /**
   * Get all paths for filter condition
   * @protected
   */
  protected getFilterPaths(
    filter: string,
    state: Record<string, any>,
    paths: string[] = [],
  ): string[] {
    // we handle all parts of filter
    if (!filter) {
      return paths;
    }

    const [first, ...rest] = filter.split('*');
    const currentKey = first.replace(/^(\.+)|(\.+)$/g, ''); // trim '.'
    const restFilter = rest.join('*');
    const newPaths: string[] = [];

    // it's '*'
    if (!currentKey) {
      // first iteration
      if (paths.length === 0) {
        const keys = Object.keys(state);

        newPaths.push(...(Array.isArray(state) ? keys.map((key) => `[${key}]`) : keys));
      } else {
        paths.forEach((key) => {
          const stateBranch = _.get(state, key) as Record<string, any> | Record<string, any>[];
          const keys = Object.keys(stateBranch);

          keys.forEach((childKey) => {
            newPaths.push([key, childKey].join('.'));
          });
        });
      }
    } else if (paths.length === 0) {
      // first iteration
      newPaths.push(currentKey);
    } else {
      // it's string part, just join every key
      paths.forEach((key) => {
        newPaths.push([key, currentKey].join('.'));
      });
    }

    return this.getFilterPaths(restFilter, state, newPaths);
  }

  /**
   * Get state by filter
   * @protected
   */
  protected getStateByFilter(
    filter: string,
    state: Record<string, any>,
  ): Record<string, any> | Record<string, any>[] | undefined {
    const paths = this.getFilterPaths(filter, state);
    const filterState = {};

    paths.forEach((path) => {
      _.set(filterState, path, _.get(state, path));
    });

    return filterState;
  }

  /**
   * Get stores state for reactotron
   * @protected
   */
  protected getStoresState(filters: string[] = []): IStateChanges[] {
    const changes: IStateChanges[] = [];
    const state: { root: Record<string, any> } = { root: {} };
    const stores = Manager.get().getStores();

    if (filters.length === 0) {
      return changes;
    }

    Manager.get()
      .getStoresRelations()
      .forEach(({ ids, componentName }, contextId) => {
        const key = this.getContextKey(contextId);

        ids.forEach((id) => {
          const store = stores.get(id);

          if (store) {
            const storeState = store?.toJSON?.() ?? Manager.getObservableProps(store);

            _.set(state, `${key}.stores.${id}`, storeState);
            _.set(state, `${key}.componentName`, componentName);
          }
        });
      });

    filters.forEach((filter) => {
      changes.push({
        path: filter,
        value: filter === '*' ? state.root : this.getStateByFilter(filter, state.root),
      });
    });

    return changes;
  }

  /**
   * Send stores keys to state
   * @protected
   */
  protected sendStoresKeys(): void {
    this.reactotron.stateKeysResponse?.(null, Object.keys(this.getStoresState()));
  }

  /**
   * Send stores values to state
   * @protected
   */
  protected sendStoresValues(): void {
    this.reactotron.stateValuesResponse?.(null, this.getStoresState());
  }

  /**
   * Subscribe on stores changes
   * @protected
   */
  protected subscribeStoresChanges(payload: Record<string, any>): void {
    const { defaultSubscribe } = this.config;
    const filters: string[] = [...new Set([...(payload?.paths ?? []), defaultSubscribe])].filter(
      Boolean,
    );
    const handler = _.throttle(
      () => {
        this.reactotron.stateValuesChange?.(this.getStoresState(filters));
      },
      500,
      { leading: true, trailing: true },
    );

    CommandHandler.listeners[Listeners.SPY] = spy(handler);
    CommandHandler.listeners['eventManager'] = EventManager.subscribeChannels(
      [Events.ADD_STORE, Events.DELETE_STORE],
      handler,
    );

    this.reactotron.stateValuesChange?.(this.getStoresState(filters));
  }

  /**
   * Create backup stores
   * @protected
   */
  protected sendBackup(): void {
    this.reactotron.send('state.backup.response', { state: this.getStoresState(['*']) });
  }

  /**
   * Restore state
   * @protected
   */
  protected restoreState(contextState: Record<string, any>): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.values(contextState).forEach(({ stores, componentName, ...otherContexts }) => {
      Object.entries(stores as Record<string, any>).forEach(
        ([storeId, storeState]: [string, Record<string, any>]) => {
          const originalStore = Manager.get().getStores().get(storeId);

          // restore store state
          if (originalStore) {
            runInAction(() => {
              console.log('ASSIGN');
              Object.assign(originalStore, storeState);
            });
          }
        },
      );

      if (!_.isEmpty(otherContexts)) {
        this.restoreState(otherContexts as Record<string, any>);
      }
    });
  }

  /**
   * Restore state from backup
   * @protected
   */
  protected restoreBackup(payload: Record<string, any>): void {
    const state: Record<string, any> = payload?.state?.[0]?.value ?? {};

    this.restoreState(state);
  }

  /**
   * Handle command
   */
  public handle({ type, payload }: IReactotronCommand): void {
    switch (type) {
      case 'state.keys.request':
        return this.sendStoresKeys();

      case 'state.values.request':
        return this.sendStoresValues();

      case 'state.values.subscribe':
        return this.subscribeStoresChanges(payload);

      case 'state.backup.request':
        return this.sendBackup();

      case 'state.restore.request':
        return this.restoreBackup(payload);
    }
  }
}

export default CommandHandler;
