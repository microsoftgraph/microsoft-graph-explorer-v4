export interface IAction {
  type: string;
  response: object | string;
}

export enum Mode {
  TryIt = 'TRYIT',
  Complete = 'COMPLETE',
}

export enum LoginType {
  Redirect = 'REDIRECT',
  Popup = 'POPUP',
}

export enum ContentType {
  XML = 'application/xml',
  Json = 'application/json',
  Image = 'image/jpeg'
}
