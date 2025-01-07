export interface IStatus {
  messageBarType: string;
  ok?: boolean;
  status: number | string;
  statusText: string;
  duration?: number;
  hint?: string;
}