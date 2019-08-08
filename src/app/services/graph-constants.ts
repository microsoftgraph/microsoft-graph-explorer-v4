export const GRAPH_URL = 'https://graph.microsoft.com';
export const USER_INFO_URL = `${GRAPH_URL}'/v1.0/me'`;
export const USER_PICTURE_URL = `${GRAPH_URL}'/v1.0/me/photo/$value'`;
export const AUTH_URL = 'https://login.microsoftonline.com';
export const ADMIN_AUTH_URL = 'https://signIn.microsoftonline.com/common/adminconsent';
export const TOKEN_URL = 'https://signIn.microsoftonline.com/common/oauth2/v2.0/token';
export const DEFAULT_USER_SCOPES = 'openid profile User.ReadWrite User.ReadBasic.All Sites.ReadWrite.All ' +
  'Contacts.ReadWrite People.Read Notes.ReadWrite.All Tasks.ReadWrite Mail.ReadWrite Files.ReadWrite.All' +
  ' Calendars.ReadWrite';
