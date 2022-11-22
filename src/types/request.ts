import { IDimensions } from './dimensions';
import { Mode } from './enums';
import { Header, IQuery } from './query-runner';

export interface IHeadersListControl {
  handleOnHeaderDelete: Function;
  headers?: Header[];
  messages: any;
  handleOnHeaderEdit: Function;
}

export interface IRequestHeadersProps {
  sampleQuery: IQuery;
  height: string;
  actions?: {
    setSampleQuery: Function;
  };
  intl: {
    message: object;
  };
}

export interface IRequestComponent {
  sampleQuery: IQuery;
  mode: Mode;
  handleOnEditorChange: Function;
  dimensions: IDimensions;
  headers?: Header[];
  intl: {
    messages: object;
  };
  actions: {
    setDimensions: Function;
  };
  officeBrowserFeedback: any;
  enableShowSurvey: boolean;
}

export interface IRequestOptions {
  headers?: {};
  method?: string;
  body?: string;
}

export interface IRequestState {
  headers: Header[];
  headerName: string;
  headerValue: string;
}
