import type { Reactotron } from 'reactotron-core-client';
import type { ICommandHandler } from './command-handler';
import CommandHandler from './command-handler';
import type { IReactotronCommand } from './types';

/**
 * Reactotron plugin for mobx store manager
 * @constructor
 */
const MobxStoreManagerPlugin =
  (config: ICommandHandler = {}) =>
  (reactotron: Reactotron) => {
    const commandHandler = new CommandHandler(reactotron, config);

    return {
      onCommand: (command: IReactotronCommand) => {
        const { type } = command ?? {};

        if (!type) {
          return;
        }

        commandHandler.handle(command);
      },
    };
  };

export default MobxStoreManagerPlugin;
