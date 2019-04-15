export interface IQueryRunnerState {
  httpMethods: Array<{ key: string; text: string; }>;
  selectedVerb: string;
  sampleUrl: string;
  sampleBody: object;
  sampleHeaders: object;
}

export interface IQuery {
  selectedVerb?: string;
  sampleURL: string;
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
