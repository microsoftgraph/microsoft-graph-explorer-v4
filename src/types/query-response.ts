import { Mode } from './action';

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
  actions: {
    getConsent: Function;
  };
}
