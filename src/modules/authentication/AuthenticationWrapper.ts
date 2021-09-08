import {
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError,
  PopupRequest,
  SilentRequest,
} from '@azure/msal-browser';

import {
  AUTH_URL,
  DEFAULT_USER_SCOPES,
  HOME_ACCOUNT_KEY,
} from '../../app/services/graph-constants';
import { signInAuthError } from '../../app/views/authentication/AuthenticationErrorsHints';
import { geLocale } from '../../appLocale';
import { getCurrentUri } from './authUtils';
import IAuthenticationWrapper from './IAuthenticationWrapper';
import { msalApplication } from './msal-app';

const defaultScopes = DEFAULT_USER_SCOPES.split(' ');

export class AuthenticationWrapper implements IAuthenticationWrapper {
  private static instance: AuthenticationWrapper;
  private consentingToNewScopes: boolean = false;

  public static getInstance(): AuthenticationWrapper {
    if (!AuthenticationWrapper.instance) {
      AuthenticationWrapper.instance = new AuthenticationWrapper();
    }
    return AuthenticationWrapper.instance;
  }

  public getSessionId(): string | null {
    const account = this.getAccount();
    if (account) {
      const idTokenClaims: any = account?.idTokenClaims;
      return idTokenClaims?.sid;
    }
    return null;
  }

  public async logIn(sessionId = ''): Promise<AuthenticationResult> {
    this.consentingToNewScopes = false;
    try {
      return await this.getAuthResult([], sessionId);
    } catch (error) {
      throw error;
    }
  }

  public logOut() {
    this.deleteHomeAccountId();
    msalApplication.logout();
  }

  public async logOutPopUp() {
    const endSessionEndpoint = (await msalApplication.getDiscoveredAuthority())
      .endSessionEndpoint;
    (window as any).open(endSessionEndpoint, 'msal', 400, 600);
    this.clearCache();
    this.deleteHomeAccountId();
  }

  /**
   * Generates a new access token from passed in scopes
   * @param {string[]} scopes passed to generate token
   *  @returns {Promise.<AuthenticationResult>}
   */
  public async consentToScopes(scopes: string[] = []): Promise<AuthenticationResult> {
    this.consentingToNewScopes = true;
    try {
      const authResult = await this.loginWithInteraction(scopes);
      return authResult;
    } catch (error) {
      throw error;
    }
  }

  private getAccount(): AccountInfo | undefined {
    if (!msalApplication) {
      return undefined;
    }

    const allAccounts = msalApplication.getAllAccounts();
    if (!allAccounts || allAccounts.length === 0) {
      return undefined;
    }

    if (allAccounts.length > 1) {
      const homeAccountId = this.getHomeAccountId();
      return homeAccountId
        ? msalApplication.getAccountByHomeId(homeAccountId) || undefined
        : undefined;
    }

    return allAccounts[0];
  }

  public async getToken() {
    const silentRequest: SilentRequest = {
      scopes: defaultScopes, authority: this.getAuthority(),
      account: this.getAccount(), redirectUri: getCurrentUri()
    };
    try {
      const response: AuthenticationResult =
        await msalApplication.acquireTokenSilent(silentRequest);
      return response;
    } catch (error) {

      throw error;
    }
  }

  private async getAuthResult(scopes: string[] = [], sessionId?: string): Promise<AuthenticationResult> {
    const silentRequest: SilentRequest = {
      scopes: scopes.length > 0 ? scopes : defaultScopes,
      authority: this.getAuthority(),
      account: this.getAccount(),
      redirectUri: getCurrentUri()
    };

    try {
      const result = await msalApplication.acquireTokenSilent(silentRequest);
      this.storeHomeAccountId(result.account!);
      return result;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError || !this.getAccount()) {

        return this.loginWithInteraction(silentRequest.scopes, sessionId);

      } else if (signInAuthError(error)) {
        this.deleteHomeAccountId();
        throw error;
      }
      else {
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
      extraQueryParameters: { mkt: geLocale },
    };

    if (this.consentingToNewScopes) {
      delete popUpRequest.prompt;
      popUpRequest.loginHint = this.getAccount()?.username;
    }

    if (sessionId) {
      popUpRequest.sid = sessionId;
      delete popUpRequest.prompt;
    }

    try {
      const result = await msalApplication.loginPopup(popUpRequest);
      this.storeHomeAccountId(result.account!);
      return result;
    } catch (error) {
      const { errorCode } = error;
      if (signInAuthError(errorCode) && !this.consentingToNewScopes) {
        this.clearSession();

        if (errorCode === 'interaction_in_progress') {
          this.eraseInteractionInProgressCookie();
        }
        throw error;
      }
      else {
        throw error;
      }

    }
  }

  private storeHomeAccountId(account: AccountInfo): void {
    localStorage.setItem(HOME_ACCOUNT_KEY, account.homeAccountId);
  }

  private getHomeAccountId(): string | null {
    return localStorage.getItem(HOME_ACCOUNT_KEY);
  }

  public deleteHomeAccountId(): void {
    localStorage.removeItem(HOME_ACCOUNT_KEY);
  }

  /**
   * This is an own implementation of the  clearCache() function that is no longer available;
   * to support logging out via Popup which is not currently native to the msal application.
   *
   * It assumes that all msal related keys follow the format:
   * {homeAccountId}.{realm}-login.windows.net-{idtoken/accessToken/refreshtoken}-{realm}
   * and uses either the homeAccountId 'login' to get localstorage keys that contain this
   * identifier
   */
  public clearCache(): void {
    const keyFilter = this.getHomeAccountId() || 'login';
    const msalKeys = Object.keys(localStorage).filter((key) =>
      key.includes(keyFilter)
    );
    msalKeys.forEach((item: string) => {
      localStorage.removeItem(item);
    });
  }

  private eraseInteractionInProgressCookie(): void {
    const keyValuePairs = document.cookie.split(';');
    let cookieValue = '';
    let cookieKey = '';

    for (const pair of keyValuePairs) {
      cookieValue = pair.substring(pair.indexOf('=') + 1);
      if (cookieValue === 'interaction_in_progress') {
        cookieKey = pair.substring(1, pair.indexOf('='));
        break;
      }
    }
    this.createCookie(cookieKey, "", -100);
  }

  private createCookie(name: string, value: string, days: number): void {
    let expires = ''
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  public clearSession(): void {
    this.clearCache();
    this.deleteHomeAccountId();
    window.sessionStorage.clear();
  }
}
