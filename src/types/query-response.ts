import { Mode } from './enums';
import { IQuery } from './query-runner';

export interface IQueryResponseProps {
  mode: Mode;
  dispatch: Function;
  graphResponse?: IGraphResponse;
  verb: string;
  theme: string;
  scopes: string[];
  sampleQuery: IQuery;
  actions: {
    getConsent: Function;
  };
  mobileScreen: boolean;
}


export interface IGraphResponseExtra {
  contentDownloadUrl: string;
  throwsCorsError: boolean;
}

export interface IGraphResponse {
  isLoadingData: boolean;
  response: {
    body: string | ReadableStream | IGraphResponseExtra
    headers: Record<string, string>;
  }
}

export const isIgraphExtra = (body: string | ReadableStream | IGraphResponseExtra): body is IGraphResponseExtra => {
  return (body as IGraphResponseExtra).contentDownloadUrl !== undefined;
}

