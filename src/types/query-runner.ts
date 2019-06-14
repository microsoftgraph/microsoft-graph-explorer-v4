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
  actions?: {
    runQuery: Function;
    setSampleQuery: Function;
  };
  sampleQuery: IQuery;
}

export interface IQueryInputControl {
  handleOnRunQuery: Function;
  handleOnMethodChange: Function;
  handleOnUrlChange: Function;
  httpMethods: Array<{ key: string; text: string}>;
  selectedVerb: string;
  sampleUrl: string;
  submitting: boolean;
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
