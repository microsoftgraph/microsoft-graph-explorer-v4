export interface IAction {
  type: string;
  response: object | string;
}

export interface IApiResponse {
  error: object | string | null;
  data: object | string | null;
  pending: boolean;
}

