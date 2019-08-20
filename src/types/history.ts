export interface IHistoryItem {
  url: string;
  method: string;
  headers?: Array<{ name: string; value: string; }>;
  category?: string;
  body?: string;
  runTime: string;
  status: number;
  response: object;
  duration: number;
}
