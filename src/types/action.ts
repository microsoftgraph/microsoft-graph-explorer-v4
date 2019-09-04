export interface IAction {
  type: string;
  response: object | string | boolean;
}

export enum Mode {
  TryIt = 'TRYIT',
  Complete = 'COMPLETE',
}
