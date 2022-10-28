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
