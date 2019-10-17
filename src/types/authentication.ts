import { ITheme } from 'office-ui-fabric-react';

export interface IAuthenticationProps {
  theme?: ITheme;
  styles?: object;
  actions?: {
    signIn: Function;
  };
  tokenPresent: boolean;
  mobileScreen: boolean;
}
