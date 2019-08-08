export interface IQueryRunnerState {
  httpMethods: Array<{ key: string; text: string; }>;
  sampleBody?: string;
}

export interface IQuery {
  selectedVerb: string;
  sampleUrl: string;
  sampleBody?: string;
  sampleHeaders?: Array<{ name: string; value: string; }>;
}

export interface IQueryRunnerProps {
  isLoadingData: boolean;
  headers: Array<{ name: string; value: string; }>;
  onSelectVerb: Function;
  sampleQuery: IQuery;
  actions?: {
    runQuery: Function;
    addRequestHeader: Function;
    setSampleQuery: Function;
  };
}

export interface IQueryInputProps {
  handleOnRunQuery: Function;
  handleOnMethodChange: Function;
  handleOnUrlChange: Function;
  httpMethods: Array<{ key: string; text: string }>;
  selectedVerb: string;
  sampleUrl: string;
  submitting: boolean;
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
  skipTest?: boolean;
  category: string;
  requestUrl: string;
  method: string;
  humanName: string;
  tip?: string;
  postBody?: string;
  headers?: Array<{ name: string; value: string; }>;
}