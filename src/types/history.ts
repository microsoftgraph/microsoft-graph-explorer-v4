import { ITheme } from '@fluentui/react';
import { Header } from './query-runner';

export interface IHistoryItem extends History {
  index: number;
  statusText: string;
  responseHeaders: Header[];
  result: object;
}

interface History {
  url: string;
  method: string;
  headers: Header[];
  createdAt: string;
  status: number;
  response?: Response;
  duration: number;
  body?: string;
  category?: string;
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
