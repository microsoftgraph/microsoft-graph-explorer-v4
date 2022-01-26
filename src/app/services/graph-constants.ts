export const GRAPH_URL = 'https://graph.microsoft.com';
export const GRAPH_API_VERSIONS = ['v1.0','beta'];
export const USER_INFO_URL = `${GRAPH_URL}/v1.0/me`;
export const BETA_USER_INFO_URL = `${GRAPH_URL}/beta/me/profile`;
export const USER_PICTURE_URL = `${GRAPH_URL}/beta/me/photo/$value`;
export const AUTH_URL = 'https://login.microsoftonline.com';
export const DEFAULT_USER_SCOPES = 'openid profile User.Read';
export const DEVX_API_URL = 'https://graphexplorerapi.azurewebsites.net';
export const GRAPH_API_SANDBOX_URL =
  'https://proxy.apisandbox.msdn.microsoft.com/svc';
export const GRAPH_API_SANDBOX_ENDPOINT_URL =
  'https://cdn.graph.office.net/en-us/graph/api/proxy/endpoint';
export const HOME_ACCOUNT_KEY = 'fbf1ecbe-27ab-42d7-96d4-3e6b03682ee4';
export enum ACCOUNT_TYPE {
  AAD = 'AAD',
  MSA = 'MSA',
  UNDEFINED = 'UNDEFINED'
}
export enum PERMS_SCOPE {
  WORK = 'DelegatedWork',
  APPLICATION = 'Application',
  PERSONAL = 'DelegatedPersonal'
}
export enum WORKLOAD {
  ONEDRIVE = 'OneDrive',
  O365REPORTING = 'O365Reporting'
}
export const ADAPTIVE_CARD_URL =
  'https://templates.adaptivecards.io/graph.microsoft.com';
export const GRAPH_TOOOLKIT_EXAMPLE_URL = 'https://mgt.dev/?path=/story';
export const MOZILLA_CORS_DOCUMENTATION_LINK =
  'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS';
export const ONE_DRIVE_CONTENT_DOWNLOAD_DOCUMENTATION_LINK =
  'https://docs.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0&tabs=http';
export const CORS_ERROR_QUERIES = new Map([
  ['groups/{groups-id}/drive/items/{items-id}/content', WORKLOAD.ONEDRIVE],
  ['sites/{sites-id}/drive/items/{items-id}/content', WORKLOAD.ONEDRIVE],
  ['users/{users-id}/drive/items/{items-id}/content', WORKLOAD.ONEDRIVE],
  ['drives/{drives-id}/items/{items-id}/content', WORKLOAD.ONEDRIVE],
  ['shares/{shares-id}/driveItem/content', WORKLOAD.ONEDRIVE],
  ['me/drive/items/{items-id}/content', WORKLOAD.ONEDRIVE],
  ['me/drive/root:<value>/content', WORKLOAD.ONEDRIVE],
  ['reports/getYammerGroupsActivityDetail(period=<value>)', WORKLOAD.O365REPORTING],
  ['reports/getTeamsDeviceUsageUserCounts(period=<value>)', WORKLOAD.O365REPORTING],
  ['reports/getSharePointSiteUsageDetail(period=<value>)',WORKLOAD.O365REPORTING],
  ['reports/getOneDriveUsageFileCounts(period=<value>)', WORKLOAD.O365REPORTING]
]);
