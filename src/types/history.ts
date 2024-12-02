import { ITheme } from '@fluentui/react';
import { Header } from './query-runner';
import { IGraphResponseExtra } from './query-response';

export interface IHistoryItem extends IHistory {
  index: number;
}

interface IHistory {
  url: string;
  result: string | ReadableStream | IGraphResponseExtra;
  method: string;
  headers: Header[];
  createdAt: string;
  status: number;
  statusText: string;
  response?: Response;
  duration: number;
  body?: string;
  category?: string;
  responseHeaders: { [key: string]: string };
}

export interface IHistoryProps {
  actions?: {
    runQuery: Function;
    setSampleQuery: Function;
    removeHistoryItem: Function;
    viewHistoryItem: Function;
    setQueryResponseStatus: Function;
    bulkRemoveHistoryItems: Function;
  };
  theme?: ITheme;
  styles?: object;
  history: History[];
}
