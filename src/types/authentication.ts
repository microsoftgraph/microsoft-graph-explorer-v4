import { ITheme } from '@fluentui/react';
import { Mode } from './enums';

export interface IAuthenticationProps {
  theme?: ITheme;
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

export interface IAuthenticateResult {
  pending: boolean;
  token: boolean;
}
