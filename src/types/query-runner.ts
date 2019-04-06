export interface IQueryRunnerState {
  httpMethods: Array<{ key: string; text: string; }>;
  selectedVerb: string;
  sampleURL: string;
  sampleBody?: string;
  headers: Array<{ name: string; value: string; }>;
  headerName: string;
  headerValue: string;
}

export interface IQuery {
  selectedVerb?: string;
  sampleURL: string;
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
  sampleURL: string;
}

export interface IAction {
  type: string;
  response: object;
}
