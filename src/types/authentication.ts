import { ITheme } from 'office-ui-fabric-react';
import { Mode } from './enums';

export interface IAuthenticationProps {
  theme?: ITheme;
  intl: {
    message: object;
  };
  styles?: object;
  actions?: {
    signIn: Function;
    storeScopes: Function;
    setQueryResponseStatus: Function;
  };
  tokenPresent: boolean;
  mobileScreen: boolean;
  minimised: boolean;
  graphExplorerMode: Mode;
}
