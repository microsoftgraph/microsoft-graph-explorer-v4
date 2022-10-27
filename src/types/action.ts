export interface AppAction {
  type: string;
  response: object | string | any | undefined;
}

export interface IApiResponse {
  error: object | string | null;
  data: object | string | null | undefined;
  pending: boolean;
}

