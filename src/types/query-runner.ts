export interface IQueryRunnerState {
  httpMethods: Array<{ key: string; text: string; }>;
  selectedVerb: string;
  sampleURL: string;
}

export interface IQueryRunnerProps {
  actions?: {
    runQuery: Function;
  };
}

export interface IQueryInputControl {
  handleOnClick: Function;
  handleOnMethodChange: Function;
  handleOnUrlChange: Function;
  httpMethods: Array<{ key: string; text: string}>;
  selectedVerb: string;
  sampleURL: string;
}

export interface IAction {
  type: string;
  response: string;
}
