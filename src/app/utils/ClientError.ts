interface IMetaInfo {
  error: string;
}

export class ClientError extends Error {
  constructor(meta: IMetaInfo = { error: '' }) {
    super(meta.error);
    Object.assign(this, meta);
    this.name = 'Client Error';
    this.message = meta.error;
  }
}