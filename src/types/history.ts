import { ITheme } from '@uifabric/styling';

export interface IHistoryItem {
  url: string;
  method: string;
  headers?: Array<{ name: string; value: string; }>;
  category?: string;
  body?: string;
  createdAt: string;
  status: number;
  response: object;
  duration: number;
}

export interface IHistoryProps {
  theme?: ITheme;
  styles?: object;
  history: Array<{
    url: string;
    method: string;
    headers?: Array<{ name: string; value: string; }>;
    category?: string;
    body?: string;
    createdAt: string;
    status: number;
    response: object;
    duration: number;
  }>;
}
