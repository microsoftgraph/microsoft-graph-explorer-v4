import { MessageBarType } from 'office-ui-fabric-react';

export interface IStatus {
  messageType: MessageBarType;
  ok: boolean;
  status: number;
  statusText: string;
  duration?: number;
}