import { ITheme } from 'office-ui-fabric-react';

export interface IAuthenticationProps {
  theme?: ITheme;
  styles?: object;
  actions?: {
    signIn: Function;
    storeScopes: Function;
  };
  tokenPresent: boolean;
  mobileScreen: boolean;
  minimised: boolean;
}
