import { ClientError } from './ClientError';

interface IScopesError {
  url: string;
  message: string;
  messageType: number;
  status: number;
}

export class ScopesError extends ClientError {
  message: string;
  messageType: number;
  status: number;
  url: string;

  constructor(error: IScopesError = { url: '', message: '', messageType: 0, status: 0 }) {
    super();
    Object.assign(this, error);
    this.name = 'ScopesError';
    this.url = error.url;
    this.message = error.message;
    this.messageType = error.messageType;
    this.status = error.status;
  }
}