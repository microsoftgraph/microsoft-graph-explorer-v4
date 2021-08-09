export const GRAPH_URL = 'https://graph.microsoft.com';
export const USER_INFO_URL = `${GRAPH_URL}/v1.0/me`;
export const BETA_USER_INFO_URL = `${GRAPH_URL}/beta/me/profile`;
export const USER_PICTURE_URL = `${GRAPH_URL}/beta/me/photo/$value`;
export const AUTH_URL = 'https://login.microsoftonline.com';
export const DEFAULT_USER_SCOPES = 'openid profile User.Read';
export const DEVX_API_URL = 'https://graphexplorerapi.azurewebsites.net';
export const GRAPH_API_SANDBOX_URL = 'https://proxy.apisandbox.msdn.microsoft.com/svc';
export const GRAPH_API_SANDBOX_ENDPOINT_URL = 'https://cdn.graph.office.net/en-us/graph/api/proxy/endpoint';
export const HOME_ACCOUNT_KEY = 'fbf1ecbe-27ab-42d7-96d4-3e6b03682ee4';
export const TEAMS_APP_INSTALLATION_URL = "https://graph.microsoft.com/v1.0/me/teamwork/installedApps?$expand=teamsApp";
export enum ACCOUNT_TYPE {
    AAD = "AAD",
    MSA = "MSA"
};
export enum PERMS_SCOPE {
    WORK = "DelegatedWork",
    APPLICATION = "Application",
    PERSONAL = "DelegatedPersonal"
};
export enum PERMISSION_MODE_TYPE {
    TeamsApp,
    User
}
export const RSC_PERMISSIONS_ENDINGS = [".Group", ".Chat"];
export const RSC_URL = "https://docs.microsoft.com/en-us/microsoftteams/platform/graph-api/rsc/resource-specific-consent";
export const RSC_HIDE_POPUP = "do not show RSC popup again"
export const APP_IMAGE = "https://docs.microsoft.com/en-us/microsoftteams/platform/assets/icons/graph-icon-1.png";
export const TEAMS_APP_ID = "c9c5f709-36f4-4ea4-b9f0-50b8c8792e54";
export const TEAMS_APP_URL = "https://www.bing.com/?form=000010";
export const ADAPTIVE_CARD_URL = 'https://templates.adaptivecards.io/graph.microsoft.com';
