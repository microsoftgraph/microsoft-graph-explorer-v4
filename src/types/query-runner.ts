export interface IQueryRunnerState {
  httpMethods: Array<{ key: string; text: string; }>;
  selectedVerb: string;
  sampleUrl: string;
  sampleBody?: string;
  sampleHeaders: object;
}

export interface IQuery {
  selectedVerb: string;
  sampleUrl: string;
  sampleBody?: string;
  sampleHeaders: Array<{ name: string; value: string; }>;
}

export interface IQueryRunnerProps {
  isLoadingData: boolean;
  headers: Array<{ name: string; value: string; }>;
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
  submitting: boolean;
}
