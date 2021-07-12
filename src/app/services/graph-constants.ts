export const GRAPH_URL = 'https://graph.microsoft.com';
export const USER_INFO_URL = `${GRAPH_URL}/v1.0/me`;
export const BETA_USER_INFO_URL = `${GRAPH_URL}/beta/me/profile`;
export const USER_PICTURE_URL = `${GRAPH_URL}/beta/me/photo/$value`;
export const AUTH_URL = 'https://login.microsoftonline.com';
export const DEFAULT_USER_SCOPES = 'openid profile User.Read';
export const DEVX_API_URL = 'https://graphexplorerapi.azurewebsites.net';
export const GRAPH_API_SANDBOX_URL = 'https://proxy.apisandbox.msdn.microsoft.com/svc';
export const HOME_ACCOUNT_KEY = 'fbf1ecbe-27ab-42d7-96d4-3e6b03682ee4';
export enum ACCOUNT_TYPE {
    AAD = "AAD",
    MSA = "MSA"
};
export enum PERMS_SCOPE {
    WORK = "DelegatedWork",
    APPLICATION = "Application",
    PERSONAL = "DelegatedPersonal"
};
export const ADAPTIVE_CARD_URL = 'https://templates.adaptivecards.io/graph.microsoft.com';
