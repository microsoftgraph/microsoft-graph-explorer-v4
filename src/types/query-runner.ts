export interface IQueryRunnerState {
  sampleBody?: string;
  url: string;
}

export interface Header {
  name: string;
  value: string;
}

export interface IQuery {
  selectedVerb: string;
  selectedVersion: string;
  sampleUrl: string;
  sampleBody?: string;
  sampleHeaders: Header[];
}

export interface IQueryRunnerProps {
  headers?: Header[];
  onSelectVerb: Function;
  sampleQuery: IQuery;
  actions?: {
    runQuery: Function;
    addRequestHeader: Function;
    setSampleQuery: Function;
    setQueryResponseStatus: Function;
  };
}

export interface IQueryInputProps {
  styles?: object;
  handleOnRunQuery: Function;
  handleOnMethodChange: Function;
  handleOnVersionChange: Function;
  actions?: {
    setSampleQuery: Function;
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
  headers?: Header[];
}

export interface ISampleQueriesProps {
  styles?: object;
  tokenPresent: boolean;
  profile: object;
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
    setQueryResponseStatus: Function;
  };
}

export const httpMethods: Record<string, string> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};
