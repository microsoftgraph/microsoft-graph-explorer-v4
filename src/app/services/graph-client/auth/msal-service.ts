import { AuthenticationResult } from '@azure/msal-browser';

import { AuthenticationModule } from './authentication-module';
import { msalApplication } from './msal-app';

const authModule = AuthenticationModule.getInstance();

export function getSessionId() {
  const account = authModule.getAccount();
  const idTokenClaims: any = account?.idTokenClaims;
  return idTokenClaims?.sid;
}

export async function getToken() {
  return await authModule.getToken();
}

export async function logIn(sessionId = ''): Promise<AuthenticationResult> {
  try {
    return await authModule.getAuthResult([], sessionId);
  } catch (error) {
    throw error;
  }
}

export function logOut() {
  msalApplication.logout();
}

export async function logOutPopUp() {
  return await authModule.logOutPopUp();
}

/**
 * Generates a new access token from passed in scopes
 * @param {string[]} scopes passed to generate token
 *  @returns {Promise.<any>}
 */
export async function acquireNewAccessToken(scopes: string[] = []): Promise<any> {
  try {
    const authResult = await authModule.getAuthResult(scopes);
    return authResult;
  } catch (error) {
    throw error;
  }
}

