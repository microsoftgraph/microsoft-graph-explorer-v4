import { Header } from './query-runner';

export interface IHistoryItem extends History {
  index: number;
  statusText: string;
  responseHeaders: { [key: string]: string };
  result: unknown;
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