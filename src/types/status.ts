import { MessageBarType } from '@fluentui/react';

export interface IStatus {
  messageType: MessageBarType;
  ok?: boolean;
  status: number | string;
  statusText: string;
  duration?: number;
  hint?: string;
}