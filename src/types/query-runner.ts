import { ITheme } from '@uifabric/styling';
import { Mode } from './action';

export interface IQueryRunnerState {
  sampleBody?: string;
  url: string;
}

export interface IQuery {
  selectedVerb: string;
  selectedVersion: string;
  sampleUrl: string;
  sampleBody?: string;
  sampleHeaders: Array<{ name: string; value: string }>;
}

export interface IQueryRunnerProps {
  headers: Array<{ name: string; value: string }>;
  onSelectVerb: Function;
  sampleQuery: IQuery;
  graphExplorerMode: Mode;
  actions?: {
    runQuery: Function;
    addRequestHeader: Function;
    setSampleQuery: Function;
  };
}

export interface IQueryInputProps {
  theme?: ITheme;
  styles?: object;
  mode?: Mode;
  handleOnRunQuery: Function;
  handleOnMethodChange: Function;
  handleOnUrlChange: Function;
  handleOnVersionChange: Function;
  handleOnBlur: Function;
  selectedVerb: string;
  selectedVersion: string;
  sampleUrl: string;
  submitting: boolean;
  intl: {
    message: object;
  };
}

export interface IInitMessage {
  /** Message type. */
  type: 'init';
  /** The user's locale on Docs. */
  locale: string;
  /** The current Docs theme. */
  theme: 'light' | 'dark' | 'high-contrast';
  /** The text within the Docs code block. */
  code: string;
  /** Data extracted from the permissions table. Will be null if Docs cannot locate the permissions table. */
  permission: string[];
}

export interface IThemeChangedMessage {
  type: 'theme-changed';
  theme: 'light' | 'dark' | 'high-contrast';
}

export interface ISampleQuery {
  docLink?: string;
  id?: string;
  skipTest?: boolean;
  category: string;
  requestUrl: string;
  method: string;
  humanName: string;
  tip?: string;
  postBody?: string;
  headers?: Array<{ name: string; value: string }>;
}

export interface ISampleQueriesProps {
  theme?: ITheme;
  styles?: object;
  tokenPresent: boolean;
  samples: {
    pending: boolean;
    queries: ISampleQuery[];
    error: {
      message: string;
    };
  };
  actions?: {
    runQuery: Function;
    setSampleQuery: Function;
    fetchSamples: Function;
  };
  intl: {
    message: object;
  };
}
