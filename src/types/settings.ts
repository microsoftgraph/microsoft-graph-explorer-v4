export interface ISettingsProps {
  actions?: {
    changeMode: Function;
    signOut: Function;
    changeTheme: Function;
    togglePermissionsPanel: Function;
    consentToScopes: Function;
  };
  intl?: {
    message: object;
  };
}
