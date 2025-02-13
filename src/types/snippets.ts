import { IApiResponse } from './action';

export interface ISnippet extends IApiResponse {
  pending: boolean;
  data: Snippet;
  error: SnippetError;
  snippetTab?: string;
}

export interface Snippet {
  [language: string]: string
}

export interface SnippetError {
  status: number,
  error: string
}
