export interface IQueryRunnerState {
  httpMethods: Array<{ key: string; text: string; }>;
  selectedVerb: string;
  sampleUrl: string;
  sampleBody?: string;
  headers: Array<{ name: string; value: string; }>;
  headerName: string;
  headerValue: string;
  sampleHeaders: object;
}

export interface IQuery {
  selectedVerb: string;
  sampleUrl: string;
  sampleBody?: string;
}

export interface IQueryRunnerProps {
  actions?: {
    runQuery: Function;
  };
}

export interface IQueryInputControl {
  handleOnRunQuery: Function;
  handleOnMethodChange: Function;
  handleOnUrlChange: Function;
  httpMethods: Array<{ key: string; text: string}>;
  selectedVerb: string;
  sampleUrl: string;
}
