import { AuthenticationParameters } from 'msal';
import { geLocale } from '../../../appLocale';
import { LoginType } from '../../../types/enums';
import { DEFAULT_USER_SCOPES } from '../graph-constants';
import { msalApplication } from './msal-agent';

const defaultUserScopes = DEFAULT_USER_SCOPES.split(' ');
const loginType = getLoginType();
msalApplication.handleRedirectCallback(authCallback);

const loginRequest: AuthenticationParameters = {
  scopes: defaultUserScopes,
  authority: getAuthority(),
  prompt: 'select_account',
  redirectUri: getCurrentUri().toLowerCase(),
  extraQueryParameters: { mkt: geLocale }
};

export function getSessionId() {
  const account = msalApplication.getAccount();

  if (account) {
    return account.idTokenClaims.sid;
  }
}

export async function getToken() {
  const authResponse = await msalApplication.acquireTokenSilent(loginRequest);
  return authResponse;
}

// get current uri for redirect uri purpose
// ref - https://github.com/AzureAD/microsoft-authentication-library-for
//  -js/blob/9274fac6d100a6300eb2faa4c94aa2431b1ca4b0/lib/msal-browser/src/utils/BrowserUtils.ts#L49
function getCurrentUri(): string {
  return window.location.href.split('?')[0].split('#')[0];
}

function getAuthority(): string {
  // support for tenanted endpoint
  const urlParams = new URLSearchParams(location.search);
  let tenant = urlParams.get('tenant');

  if (tenant === null) {
    tenant = 'common';
  }

  return `https://login.microsoftonline.com/${tenant}/`;
}

export async function logIn(sessionId = ''): Promise<any> {

  if (sessionId !== '') {
    loginRequest.sid = sessionId;

    try {
      const authResponse = await msalApplication.acquireTokenSilent(loginRequest);
      return authResponse;
    } catch (error) {
      delete loginRequest.sid;
      const authResp = await logIn();
      return authResp;
    }
  }

  if (loginType === LoginType.Popup) {
    try {
      await msalApplication.loginPopup(loginRequest);
      return await getToken();
    } catch (error) {
      if (requiresInteraction(error)) {
        return acquireTokenWIthInteraction();
      } else {
        throw error;
      }
    }
  } else if (loginType === LoginType.Redirect) {
    await msalApplication.loginRedirect(loginRequest);
  }
}

async function acquireTokenWIthInteraction() {
  try {
    const authResponse = await msalApplication.acquireTokenPopup(loginRequest);
    return authResponse;
  } catch (error) {
    throw error;
  }
}

function authCallback(error: any, response: any) {
  return;
}

export function getAccount() {
  return msalApplication.getAccount();
}

export function logOut() {
  msalApplication.logout();
}

export function logOutPopUp() {
  // @ts-ignore
  msalApplication.clearCache();
  // @ts-ignore
  msalApplication.account = null;
  // @ts-ignore
  msalApplication.authorityInstance.resolveEndpointsAsync().then(authority => {
    const urlNavigate = authority.EndSessionEndpoint
      ? authority.EndSessionEndpoint
      : `${msalApplication.authority}oauth2/v2.0/logout`;
    (msalApplication as any).openPopup(urlNavigate, 'msal', 400, 600);
  });
}

/**
 * Generates a new access token from passed in scopes
 * @param {string[]} scopes passed to generate token
 *  @returns {Promise.<any>}
 */
export async function acquireNewAccessToken(scopes: string[] = []): Promise<any> {
  loginRequest.scopes = scopes;
  if (loginType === LoginType.Popup) {
    try {
      const authResponse = await msalApplication.acquireTokenPopup(loginRequest);
      return authResponse;
    } catch (error) {
      throw error;
    }
  } else if (loginType === LoginType.Redirect) {
    await msalApplication.acquireTokenRedirect(loginRequest);
  }
}

/**
 * Checks whether the error requires user interaction
 * Returns whether to load the POPUP/REDIRECT interaction
 * @returns boolean
 */
function requiresInteraction(error: any): boolean {
  const { errorCode } = error;
  if (!errorCode || !errorCode.length) {
    return false;
  }
  return errorCode === 'consent_required' ||
    errorCode === 'interaction_required' ||
    errorCode === 'login_required' ||
    errorCode === 'token_renewal_error';
}

/**
 * Returns whether to load the POPUP/REDIRECT interaction
 * @returns string
 */
export function getLoginType() {
  const userAgent = window.navigator.userAgent;
  const msie = userAgent.indexOf('MSIE ');
  const msie11 = userAgent.indexOf('Trident/');
  const msedge = userAgent.indexOf('Edge/');
  const isIE = msie > 0 || msie11 > 0;
  const isEdge = msedge > 0;
  return isIE || isEdge ? LoginType.Redirect : LoginType.Popup;
}
