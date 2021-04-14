import { Mode } from './enums';
import { IQuery } from './query-runner';

export interface IQueryResponseProps {
  mode: Mode;
  dispatch: Function;
  graphResponse?: IGraphResponse;
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
  mobileScreen: boolean;
}

export interface IQueryResponseState {
  showShareQueryDialog: boolean;
  showModal: boolean;
  query: string;
}

export interface IGraphResponse {
  body: any | undefined,
  headers: any | undefined
}
