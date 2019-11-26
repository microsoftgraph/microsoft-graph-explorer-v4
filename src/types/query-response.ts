import { Mode } from './action';
import { IQuery } from './query-runner';

export interface IQueryResponseProps {
  mode: Mode;
  dispatch: Function;
  graphResponse?: {
    body: object;
    headers: object;
  };
  intl: {
    message: object;
  };
  verb: string;
  theme: string;
  scopes: string[];
  sampleQuery: IQuery;
  actions: {
    getConsent: Function;
  };
}

export interface IQueryResponseState {
  showShareQueryDialog: boolean;
  query: string;
}
