import { IQuery } from '../../../types/query-runner';

export interface IResponseHeaders {
  [key: string]: string;
}
export default interface IClaimsChallenge {
  handleClaimsChallenge(responseHeaders: IResponseHeaders, sampleQuery: IQuery): void;
}