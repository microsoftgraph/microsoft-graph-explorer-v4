import { AuthenticationParameters, AuthResponse, UserAgentApplication } from 'msal';
import { DEFAULT_USER_SCOPES } from '../graph-constants';
import { msalApplication } from './msal-agent';

const defaultUserScopes = DEFAULT_USER_SCOPES.split(' ');
const loginType = getLoginType();
msalApplication.handleRedirectCallback(authCallback);

export async function logIn(): Promise<any> {
  const loginRequest: AuthenticationParameters = {
    scopes: defaultUserScopes,
  };

  return msalApplication.loginRedirect(loginRequest);
}

function authCallback(error: any, response: any) {
  return;
}

export function logOut() {
  msalApplication.logout();
}

export async function getTokenSilent(userAgentApp: UserAgentApplication,
   scopes: string[]): Promise<AuthResponse> {
  return userAgentApp.acquireTokenSilent({ scopes });
}

/**
 * Generates a new access token from passed in scopes
 * @param {string[]} scopes passed to generate token
 *  @returns {Promise.<any>}
 */
export async function acquireNewAccessToken(userAgentApp: UserAgentApplication, scopes: string[] = []): Promise<any> {
  const loginRequest: AuthenticationParameters = {
    scopes,
  };

  // getTokenSilent(userAgentApp, scopes)).catch ((error) => {
  //   if (requiresInteraction(error.errorCode)) {
  //     if (loginType === 'POPUP') {
  //       try {
  //         return userAgentApp.acquireTokenPopup({ scopes: generateUserScopes(listOfScopes) });
  //       } catch (error) {
  //         throw error;
  //       }
  //     } else if (loginType === 'REDIRECT') {
  //       userAgentApp.acquireTokenRedirect({ scopes: generateUserScopes(listOfScopes) });
  //     }
  //   }
  // }; )
  getTokenSilent(userAgentApp, scopes)
    .catch((error: any) => {
      if (requiresInteraction(error.errorCode)) {
        userAgentApp.acquireTokenRedirect({ scopes });
      }
    });
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
