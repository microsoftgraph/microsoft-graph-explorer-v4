import { ClientError } from './ClientError';

interface IRevokeScopesError {
  errorText: string;
  statusText: string;
  messageType: number;
  status: string;
}

export class RevokeScopesError extends ClientError {
  statusText: string;
  messageType: number;
  status: string;
  errorText: string;

  constructor(error: IRevokeScopesError = { errorText: '', statusText: '', messageType: 0, status: '' }) {
    super();
    Object.assign(this, error);
    this.name = 'RevokeScopesError';
    this.errorText = error.errorText;
    this.statusText = error.statusText;
    this.messageType = error.messageType;
    this.status = error.status;
  }
}