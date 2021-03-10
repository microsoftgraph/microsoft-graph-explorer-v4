import {
  AccountInfo,
  AuthenticationResult, InteractionRequiredAuthError,
  PopupRequest, SilentRequest
} from '@azure/msal-browser';

import { geLocale } from '../../appLocale';
import { AUTH_URL, DEFAULT_USER_SCOPES } from '../../app/services/graph-constants';
import { getCurrentUri } from './authUtils';
import { msalApplication } from './msal-app';

const defaultScopes = DEFAULT_USER_SCOPES.split(' ');

export class AuthenticationWrapper {

  private static instance: AuthenticationWrapper;

  public static getInstance(): AuthenticationWrapper {
    if (!AuthenticationWrapper.instance) {
      AuthenticationWrapper.instance = new AuthenticationWrapper()
    }
    return AuthenticationWrapper.instance
  }

  public getSessionId() {
    const account = this.getAccount();
    const idTokenClaims: any = account?.idTokenClaims;
    return idTokenClaims?.sid;
  }

  public async logIn(sessionId = ''): Promise<AuthenticationResult> {
    try {
      return await this.getAuthResult([], sessionId);
    } catch (error) {
      throw error;
    }
  }

  public logOut() {
    msalApplication.logout();
  }

  public async logOutPopUp() {
    const endSessionEndpoint = (await msalApplication.getDiscoveredAuthority()).endSessionEndpoint;
    (window as any).open(endSessionEndpoint, 'msal', 400, 600);
  }

  /**
 * Generates a new access token from passed in scopes
 * @param {string[]} scopes passed to generate token
 *  @returns {Promise.<any>}
 */
  public async acquireNewAccessToken(scopes: string[] = []): Promise<any> {
    try {
      const authResult = await this.getAuthResult(scopes);
      return authResult;
    } catch (error) {
      throw error;
    }
  }

  private getAccount(): AccountInfo | undefined {
    if (msalApplication) {
      const allAccounts = msalApplication.getAllAccounts();
      if (allAccounts && allAccounts.length > 0) {
        return allAccounts[0];
      }
    }
    return undefined;
  }

  public async getToken() {
    const silentRequest: SilentRequest = {
      scopes: defaultScopes,
      authority: this.getAuthority(),
      account: this.getAccount()
    };
    try {
      return await msalApplication.acquireTokenSilent(silentRequest);
    } catch (error) {
      throw error;
    }
  }

  private async getAuthResult(scopes: string[] = [], sessionId?: string): Promise<AuthenticationResult> {
    const silentRequest: SilentRequest = {
      scopes: (scopes.length > 0) ? scopes : defaultScopes,
      authority: this.getAuthority(),
      account: this.getAccount()
    };

    try {
      return await msalApplication.acquireTokenSilent(silentRequest);
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError || this.getAccount() === undefined) {
        return this.loginWithInteraction(silentRequest.scopes, sessionId);
      } else {
        throw error;
      }
    }
  }

  private getAuthority(): string {
    // support for tenanted endpoint
    const urlParams = new URLSearchParams(location.search);
    let tenant = urlParams.get('tenant');

    if (!tenant) {
      tenant = 'common';
    }

    return `${AUTH_URL}/${tenant}/`;
  }

  private async loginWithInteraction(userScopes: string[], sessionId?: string) {
    const popUpRequest: PopupRequest = {
      scopes: userScopes,
      authority: this.getAuthority(),
      prompt: 'select_account',
      redirectUri: getCurrentUri(),
      extraQueryParameters: { mkt: geLocale }
    };

    if (sessionId) {
      popUpRequest.sid = sessionId;
      delete popUpRequest.prompt;
    }

    try {
      return await msalApplication.loginPopup(popUpRequest);
    } catch (error) {
      throw error;
    }
  }
}
