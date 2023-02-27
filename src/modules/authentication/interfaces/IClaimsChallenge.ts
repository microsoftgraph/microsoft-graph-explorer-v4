import { IQuery } from '../../../types/query-runner';

export default interface IClaimsChallenge {
  handleClaimsChallenge(responseHeaders: Headers, sampleQuery: IQuery): void;
}