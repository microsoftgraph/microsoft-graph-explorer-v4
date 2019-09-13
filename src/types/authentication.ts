import { ITheme } from 'office-ui-fabric-react';

export interface IAuthenticationProps {
  theme?: ITheme;
  styles?: object;
  actions?: {
    authenticateUser: Function;
  };
  tokenPresent: boolean;
}
