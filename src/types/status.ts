import { MessageBarType } from '@fluentui/react';

export interface IStatus {
  messageType: MessageBarType;
  ok: boolean;
  status: number;
  statusText: string;
  duration?: number;
}