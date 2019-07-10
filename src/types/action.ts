export interface IAction {
  type: string;
  response: object | string;
}

export enum Mode {
  TryIt = 'TRYIT',
  Complete = 'COMPLETE',
}
