export interface IReactotronCommand {
  /**
   * The type of command.
   */
  type: string;
  /**
   * The data belonging to the command.
   */
  payload: Record<string, any>;
}

export interface IStateChanges {
  path: string;
  value: Record<string, any> | undefined | boolean | null | string;
}
