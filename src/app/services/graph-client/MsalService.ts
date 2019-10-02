import { AuthenticationParameters } from 'msal/lib-commonjs/AuthenticationParameters';
import { DEFAULT_USER_SCOPES } from '../graph-constants';
import { msalApplication } from './MsalAgent';

const loginType = getLoginType();
const defaultUserScopes = DEFAULT_USER_SCOPES.split(' ');

export async function logIn(): Promise<any> {
  const loginRequest: AuthenticationParameters = {
    scopes: defaultUserScopes,
  };

  if (loginType === 'POPUP') {
    try {
      await msalApplication.loginPopup(loginRequest);
      const response = await msalApplication.acquireTokenPopup(loginRequest);
      return response.accessToken;
    } catch (error) {
      return null;
    }
  } else if (loginType === 'REDIRECT') {
    await msalApplication.acquireTokenRedirect(loginRequest);
  }
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
  const hasScopes = (scopes.length > 0);
  let listOfScopes = defaultUserScopes;
  if (hasScopes) {
    listOfScopes = scopes;
  }

  const loginRequest: AuthenticationParameters = {
    scopes: listOfScopes,
  };

  try {
    const response = await msalApplication.acquireTokenSilent(loginRequest);
    return response;
  } catch (error) {
    if (requiresInteraction(error)) {
      if (loginType === 'POPUP') {
        try {
          return msalApplication.acquireTokenPopup(loginRequest);
        } catch (error) {
          return null;
        }
      } else if (loginType === 'REDIRECT') {
        msalApplication.acquireTokenRedirect(loginRequest);
      }
    }
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
 * Determines whether to load the POPUP/REDIRECT interaction
 * @returns a string
 */
function getLoginType(): string {
  /**
   * Always pops up
   * Graph Explorer should perform incremental permissions without losing state
   */
  return 'POPUP';
}
