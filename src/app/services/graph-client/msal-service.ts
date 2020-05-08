import { AuthenticationParameters } from 'msal';
import { geLocale } from '../../../appLocale';
import { LoginType } from '../../../types/enums';
import { DEFAULT_USER_SCOPES } from '../graph-constants';
import { msalApplication } from './msal-agent';

const defaultUserScopes = DEFAULT_USER_SCOPES.split(' ');
const loginType = getLoginType();
msalApplication.handleRedirectCallback(authCallback);

export function getSessionId() {
  const account = msalApplication.getAccount();

  if (account) {
    return account.idTokenClaims.sid;
  }
}

export async function logIn(sessionId = ''): Promise<any> {
  const loginRequest: AuthenticationParameters = {
    scopes: defaultUserScopes,
    prompt: 'select_account',
    extraQueryParameters: { mkt: geLocale }
  };

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
      const authResponse = await msalApplication.acquireTokenSilent(loginRequest);
      return authResponse;
    } catch (error) {
      if (requiresInteraction(error)) {
        return acquireTokenWIthInteraction(loginRequest);
      } else {
        throw error;
      }
    }
  } else if (loginType === LoginType.Redirect) {
    await msalApplication.loginRedirect(loginRequest);
  }
}

async function acquireTokenWIthInteraction(loginRequest: AuthenticationParameters) {
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
  const loginRequest: AuthenticationParameters = {
    scopes,
  };
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
