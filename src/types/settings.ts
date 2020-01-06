import { IThemeChangedMessage } from './query-runner';

export interface ISettingsProps {
  actions?: {
    signOut: Function;
    changeTheme: Function;
  };
  intl?: {
    message: object;
  };
  authenticated: boolean;
  appTheme: IThemeChangedMessage['theme'];
}

export interface ISettingsState {
  hideThemeChooserDialog: boolean;
  items: [];
}