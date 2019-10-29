import { AuthenticationParameters } from 'msal';
import { DEFAULT_USER_SCOPES } from '../graph-constants';
import { msalApplication } from './MsalAgent';

const defaultUserScopes = DEFAULT_USER_SCOPES.split(' ');
export async function logIn(): Promise<any> {

  const loginRequest: AuthenticationParameters = {
    scopes: defaultUserScopes,
  };

  try {
    await msalApplication.loginPopup(loginRequest);
    const authResponse = await msalApplication.acquireTokenPopup(loginRequest);
    return authResponse;
  } catch (error) {
    return null;
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
    const authResponse = await msalApplication.acquireTokenSilent(loginRequest);
    return authResponse;
  } catch (error) {
    if (requiresInteraction(error)) {
      try {
        const authResponse = await msalApplication.acquireTokenPopup(loginRequest);
        return authResponse.accessToken;
      } catch (error) {
        return null;
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
