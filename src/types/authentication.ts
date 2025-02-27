import { Mode } from './enums';

export interface IAuthenticationProps {
  styles?: object;
  actions?: {
    signIn: Function;
    storeScopes: Function;
    setQueryResponseStatus: Function;
  };
  tokenPresent: boolean;
  inProgress: boolean;
  mobileScreen: boolean;
  minimised: boolean;
  graphExplorerMode: Mode;
}

export interface AuthenticateResult {
  authToken: {
    pending: boolean;
    token: boolean;
  };
  consentedScopes: string[];
}
