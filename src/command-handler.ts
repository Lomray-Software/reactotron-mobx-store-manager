import { Manager } from '@lomray/react-mobx-manager';
import { diff } from 'deep-object-diff';
import _ from 'lodash';
import { spy } from 'mobx';
import type { Reactotron } from 'reactotron-core-client';
import type { IReactotronCommand } from './types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICommandHandler {}

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
  protected config: ICommandHandler;

  /**
   * @protected
   */
  protected reactotron: Reactotron;

  /**
   * Save state for calculate difference between updates
   * @protected
   */
  protected currentState: Record<string, any> = {};

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
    this.config = config;

    Object.values(CommandHandler.listeners).forEach((unsubscribe) => {
      unsubscribe();
    });
  }

  /**
   * Get context tree key
   * @protected
   */
  protected getContextKey(contextId: string, nestedKey = 'root'): string {
    if (contextId === 'root') {
      return nestedKey;
    }

    const { parentId } = Manager.get().getStoresRelations().get(contextId) ?? {};

    if (!parentId || parentId === 'root') {
      return `${nestedKey}.${contextId}`;
    }

    return this.getContextKey(parentId, `${nestedKey}.${contextId}`);
  }

  /**
   * Get stores state for reactotron
   * @TODO implement filters
   * @protected
   */
  protected getStoresState(filters?: string[]): { path: string; value: any }[] {
    const state: { root: Record<string, any> } = { root: {} };
    const stores = Manager.get().getStores();

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

    // apply filters?
    const changedState = diff(this.currentState, state.root);

    this.currentState = state.root;

    if (_.isEmpty(changedState)) {
      return [];
    }

    return [
      {
        path: 'state',
        // value: changedState, // @TODO filter?
        value: state.root,
      },
    ];
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
    const filters: string[] = [...new Set([...(payload?.paths ?? [])])];

    CommandHandler.listeners[Listeners.SPY] = spy((event) => {
      if (event.type === 'update' || !('name' in event)) {
        return;
      }

      this.reactotron.stateValuesChange?.(this.getStoresState(filters));
    });

    this.reactotron.stateValuesChange?.(this.getStoresState(filters));
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
    }
  }
}

export default CommandHandler;