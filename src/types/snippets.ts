import { IApiResponse } from './action';

export interface ISnippet extends IApiResponse {
  pending: boolean;
  data: any;
  error: any | null;
  snippetTab?: string;
}
