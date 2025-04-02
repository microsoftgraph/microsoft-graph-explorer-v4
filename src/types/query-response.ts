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

export interface IGraphResponse {
  isLoadingData: boolean;
  response: {
    body: any | undefined;
    headers: { [key: string]: string } | undefined;
  }
}
