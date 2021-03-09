import { AuthenticationResult } from '@azure/msal-browser';

import { AuthenticationModule } from './auth/authentication-module';
import { msalApplication } from './msal-agent';

export function getSessionId() {
  const authModule = new AuthenticationModule(msalApplication);
  const account = authModule.getAccount();
  const idTokenClaims: any = account?.idTokenClaims;
  return idTokenClaims?.sid;
}

export async function getToken() {
  const authModule = new AuthenticationModule(msalApplication);
  return await authModule.getToken();
}

export async function logIn(sessionId = ''): Promise<AuthenticationResult> {
  try {
    const authModule = new AuthenticationModule(msalApplication);
    return await authModule.getAuthResult([], sessionId);
  } catch (error) {
    throw error;
  }
}

export function logOut() {
  msalApplication.logout();
}

export async function logOutPopUp() {
  const authModule = new AuthenticationModule(msalApplication);
  return await authModule.logOutPopUp();
}

/**
 * Generates a new access token from passed in scopes
 * @param {string[]} scopes passed to generate token
 *  @returns {Promise.<any>}
 */
export async function acquireNewAccessToken(scopes: string[] = []): Promise<any> {
  try {
    const authModule = new AuthenticationModule(msalApplication);
    const authResult = await authModule.getAuthResult(scopes);
    return authResult;
  } catch (error) {
    throw error;
  }
}

