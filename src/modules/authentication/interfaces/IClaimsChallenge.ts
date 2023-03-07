import { IQuery } from '../../../types/query-runner';

export default interface IClaimsChallenge {
  handle(responseHeaders: Headers, sampleQuery: IQuery): void;
}