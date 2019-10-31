import { AuthenticationParameters, AuthResponse, UserAgentApplication } from 'msal';
import { DEFAULT_USER_SCOPES } from '../graph-constants';
import { msalApplication } from './msal-agent';

const defaultUserScopes = DEFAULT_USER_SCOPES.split(' ');

export async function logIn(): Promise<any> {
  const loginRequest: AuthenticationParameters = {
    scopes: defaultUserScopes,
  };

  return msalApplication.loginRedirect(loginRequest);
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

