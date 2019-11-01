import { AuthenticationParameters } from 'msal';
import { DEFAULT_USER_SCOPES } from '../graph-constants';
import { msalApplication } from './MsalAgent';

const defaultUserScopes = DEFAULT_USER_SCOPES.split(' ');
const loginType = getLoginType();
msalApplication.handleRedirectCallback(authCallback);

export async function logIn(): Promise<any> {
  const loginRequest: AuthenticationParameters = {
    scopes: defaultUserScopes,
  };

  if (loginType === 'POPUP') {
    try {
      await msalApplication.loginPopup(loginRequest);
      const authResponse = await msalApplication.acquireTokenPopup(loginRequest);
      return authResponse;
    } catch (error) {
      return null;
    }
  } else if (loginType === 'REDIRECT') {
    await msalApplication.loginRedirect(loginRequest);
  }
}

function authCallback(error: any, response: any) {
  return;
}

export function logOut() {
  msalApplication.logout();
}

/**
 * Generates a new access token from passed in scopes
 * @param {string[]} scopes passed to generate token
 *  @returns {Promise.<any>}
 */
export async function acquireNewAccessToken(scopes: string[] = []): Promise<any> {
  const loginRequest: AuthenticationParameters = {
    scopes,
  };
  if (loginType === 'POPUP') {
    try {
      const authResponse = await msalApplication.acquireTokenPopup(loginRequest);
      return authResponse;
    } catch (error) {
      return null;
    }
  } else if (loginType === 'REDIRECT') {
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
  return isIE || isEdge ? 'REDIRECT' : 'POPUP';
}
