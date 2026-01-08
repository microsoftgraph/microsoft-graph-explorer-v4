export const GRAPH_URL = 'https://graph.microsoft.com';
export const GRAPH_API_VERSIONS = ['v1.0', 'beta'];
export const USER_INFO_URL = `${GRAPH_URL}/v1.0/me`;
export const BETA_USER_INFO_URL = `${GRAPH_URL}/beta/me/profile`;
export const USER_PICTURE_URL = `${GRAPH_URL}/beta/me/photo/$value`;
export const AUTH_URL = 'https://login.microsoftonline.com';
export const DEFAULT_USER_SCOPES = 'openid profile User.Read';
export const GRAPH_API_SANDBOX_URL =
  'https://proxy.apisandbox.msdn.microsoft.com/svc';
export const GRAPH_API_SANDBOX_ENDPOINT_URL =
  'https://cdn.graph.office.net/en-us/graph/api/proxy/endpoint';
// MODIFIED: Use direct proxy endpoint configuration instead of dynamic fetching
// This allows proxy endpoint to be set via environment variable REACT_APP_GRAPH_API_ENDPOINT
// MODIFIED: Added /api/proxy path suffix to the configured proxy endpoint
const PROXY_ENDPOINT_BASE = process.env.REACT_APP_GRAPH_API_ENDPOINT || GRAPH_API_SANDBOX_URL;
export const GRAPH_API_PROXY_ENDPOINT = PROXY_ENDPOINT_BASE.endsWith('/')
  ? `${PROXY_ENDPOINT_BASE}api/proxy`
  : `${PROXY_ENDPOINT_BASE}/api/proxy`;
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
export const GRAPH_TOOOLKIT_EXAMPLE_URL = 'https://mgt.dev/?path=/story';
export const MOZILLA_CORS_DOCUMENTATION_LINK =
  'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS';
export const USER_ORGANIZATION_URL = `${GRAPH_URL}/v1.0/organization`;
export const NPS_FEEDBACK_URL = 'https://petrol.office.microsoft.com/v1/feedback';
// eslint-disable-next-line max-len
export const REVOKING_PERMISSIONS_REQUIRED_SCOPES = 'DelegatedPermissionGrant.ReadWrite.All Directory.Read.All';
// eslint-disable-next-line max-len
export const ADMIN_CONSENT_DOC_LINK = 'https://learn.microsoft.com/en-us/graph/security-authorization#:~:text=If%20you%27re%20calling%20the%20Microsoft%20Graph%20Security%20API%20from%20Graph%20Explorer'
// eslint-disable-next-line max-len
export const CONSENT_TYPE_DOC_LINK = 'https://learn.microsoft.com/en-us/graph/api/resources/oauth2permissiongrant?view=graph-rest-1.0#:~:text=(eq%20only).-,consentType,-String'
export const CURRENT_THEME='CURRENT_THEME';
export const EXP_URL='https://default.exp-tas.com/exptas76/9b835cbf-9742-40db-84a7-7a323a77f3eb-gedev/api/v1/tas'
export const BANNER_IS_VISIBLE = 'bannerIsVisible';
export const REPORTANISSUELINK = 'https://github.com/microsoftgraph/microsoft-graph-explorer-v4/issues/new/choose';
export const GEDOCSLINK =
  'https://learn.microsoft.com/graph/graph-explorer/graph-explorer-overview?view=graph-rest-1.0'
export const GRAPHDOCSLINK =
  'https://learn.microsoft.com/graph/api/overview?view=graph-rest-1.0'
export const GITHUBLINK = 'https://github.com/microsoftgraph/microsoft-graph-explorer-v4#readme'
export const TRACKINGPARAMS = '/?WT.mc_id=msgraph_inproduct_graphexhelp'