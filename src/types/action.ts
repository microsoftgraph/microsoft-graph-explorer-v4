export interface AppAction {
  type: string;
  response?: object | string | any | undefined;
  // TODO: change this to required and remove response when done with
  // moving to RTK.
  payload?: object | string | any | undefined;
}

export interface IApiResponse {
  error: object | string | null;
  data: object | string | null | undefined;
  pending: boolean;
}

