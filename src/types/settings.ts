import { AppTheme } from './enums';

export interface ISettingsProps {
  actions?: {
    signOut: Function;
    changeTheme: Function;
    consentToScopes: Function;
  };
  intl?: {
    message: object;
  };
}
