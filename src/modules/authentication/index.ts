import { AuthenticationWrapper } from './AuthenticationWrapper';
import { ClaimsChallenge } from './ClaimsChallenge';

export const authenticationWrapper = AuthenticationWrapper.getInstance();
export const claimsChallenge = ClaimsChallenge.getInstance();

