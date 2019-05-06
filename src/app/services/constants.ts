export const QUERY_GRAPH_SUCCESS = 'QUERY_GRAPH_SUCCESS';
export const QUERY_GRAPH_ERROR = 'QUERY_GRAPH_ERROR';
export const GET_AUTH_TOKEN_SUCCESS = 'GET_AUTH_TOKEN_SUCCESS';

export const USER_INFO_URL = 'https://graph.microsoft.com/v1.0/me';
export const USER_PICTURE_URL = 'https://graph.microsoft.com/v1.0/me/photo/$value';
export const AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
export const ADMIN_AUTH_URL = 'https://login.microsoftonline.com/common/adminconsent';
export const TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
export const DEFAULT_USER_SCOPES = 'openid profile User.ReadWrite User.ReadBasic.All Sites.ReadWrite.All ' +
'Contacts.ReadWrite People.Read Notes.ReadWrite.All Tasks.ReadWrite Mail.ReadWrite Files.ReadWrite.All' +
' Calendars.ReadWrite';
