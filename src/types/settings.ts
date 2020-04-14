import { AppTheme } from './enums';

export interface ISettingsProps {
  actions?: {
    signOut: Function;
    changeTheme: Function;
  };
  intl?: {
    message: object;
  };
  authenticated: boolean;
  appTheme: AppTheme;
}

export interface ISettingsState {
  hideThemeChooserDialog: boolean;
  items: [];
  panelIsOpen: boolean;
}