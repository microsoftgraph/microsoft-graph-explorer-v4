import { IDimensions } from './dimensions';
import { Mode } from './enums';
import { Header, IQuery } from './query-runner';

export interface IHeadersListControl {
  handleOnHeaderDelete: Function;
  headers?: Header[];
  handleOnHeaderEdit: Function;
}

export interface IRequestHeadersProps {
  sampleQuery: IQuery;
  height: string;
  actions?: {
    setSampleQuery: Function;
  };
}

export interface IRequestComponent {
  sampleQuery: IQuery;
  mode: Mode;
  handleOnEditorChange: Function;
  dimensions: IDimensions;
  headers?: Header[];
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
