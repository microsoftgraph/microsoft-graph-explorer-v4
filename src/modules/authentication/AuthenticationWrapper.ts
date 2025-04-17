import {
  AccountInfo,
  AuthenticationResult,
  BrowserAuthError,
  InteractionRequiredAuthError,
  PopupRequest,
  SilentRequest
} from '@azure/msal-browser';

import {
  AUTH_URL,
  DEFAULT_USER_SCOPES,
  HOME_ACCOUNT_KEY
} from '../../app/services/graph-constants';
import { SAFEROLLOUTACTIVE } from '../../app/services/variant-constants';
import variantService from '../../app/services/variant-service';
import { IQuery } from '../../types/query-runner';
import { ClaimsChallenge } from './ClaimsChallenge';
import { getCurrentUri } from './authUtils';
import { signInAuthError } from './authentication-error-hints';
import IAuthenticationWrapper from './interfaces/IAuthenticationWrapper';
import { msalApplication } from './msal-app';

const defaultScopes = DEFAULT_USER_SCOPES.split(' ');

export class AuthenticationWrapper implements IAuthenticationWrapper {
  private static instance: AuthenticationWrapper;
  private consentingToNewScopes: boolean = false;
  private performingStepUpAuth: boolean = false;
  private claimsAvailable: boolean = false;
  private sampleQuery: IQuery = {
    sampleUrl: '',
    selectedVerb: '',
    selectedVersion: '',
    sampleHeaders: []
  };

  public static getInstance(): AuthenticationWrapper {
    if (!AuthenticationWrapper.instance) {
      AuthenticationWrapper.instance = new AuthenticationWrapper();
    }
    return AuthenticationWrapper.instance;
  }

  public getSessionId(): string | null {
    const account = this.getAccount();
    if (account) {
      const idTokenClaims = account?.idTokenClaims;
      return idTokenClaims?.sid ?? null;
    }
    return null;
  }

  public async logIn(sessionId = '', sampleQuery?: IQuery): Promise<AuthenticationResult> {
    if (sampleQuery) {
      this.sampleQuery = sampleQuery;
      this.performingStepUpAuth = true;
    }
    this.consentingToNewScopes = false;
    // eslint-disable-next-line no-useless-catch
    try {
      const authResult = await this.getAuthResult([], sessionId);
      if (this.performingStepUpAuth && authResult) {
        this.claimsAvailable = true;
      }
      return authResult;
    } catch (error) {
      console.error('Error occurred during login:', error);
      throw error;
    }
  }

  public async logInWithOther() {
    const popUpRequest: PopupRequest = {
      scopes: defaultScopes,
      authority: this.getAuthority(),
      prompt: 'select_account',
      redirectUri: getCurrentUri(),
      extraQueryParameters: getExtraQueryParameters(),
      tokenQueryParameters: getExtraQueryParameters()
    };
    try {
      const result = await msalApplication.loginPopup(popUpRequest);
      this.storeHomeAccountId(result.account!);
      return result;
    } catch (error: unknown) {
      if (error instanceof BrowserAuthError){
        const { errorCode } = error;
        if (errorCode === 'interaction_in_progress') {
          this.eraseInteractionInProgressCookie();
        }
      }
      throw error;
    }
  }

  public async logOut() {
    const homeAccountId = this.getHomeAccountId();
    if (homeAccountId) {
      const currentAccount = msalApplication.getAccountByHomeId(homeAccountId);
      const logoutHint = currentAccount!.idTokenClaims?.login_hint;
      await msalApplication.logoutPopup({ logoutHint });
    } else {
      this.deleteHomeAccountId();
      await msalApplication.logoutRedirect();
    }
  }

  public async logOutPopUp() {
    this.deleteHomeAccountId();
    msalApplication.logoutPopup();
  }

  /**
   * Generates a new access token from passed in scopes
   * @param {string[]} scopes passed to generate token
   *  @returns {Promise.<AuthenticationResult>}
   */
  public async consentToScopes(scopes: string[] = []): Promise<AuthenticationResult> {
    this.consentingToNewScopes = true;
    // eslint-disable-next-line no-useless-catch
    try {
      return await this.loginWithInteraction(scopes);
    } catch (error) {
      throw error;
    }
  }

  public getAccount(): AccountInfo | undefined {
    if (!msalApplication) {
      return undefined;
    }

    const allAccounts: AccountInfo[] = msalApplication.getAllAccounts();
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

  public async getToken(): Promise<AuthenticationResult> {
    try {
      const account = this.getAccount();
      if (!account) {
        // If no account is found, try to get accounts from cache
        const allAccounts = msalApplication.getAllAccounts();
        if (allAccounts.length > 0) {
          this.storeHomeAccountId(allAccounts[0]);
          // Use the first account found
          const silentRequest: SilentRequest = {
            scopes: defaultScopes,
            authority: this.getAuthority(),
            account: allAccounts[0],
            redirectUri: getCurrentUri(),
            forceRefresh: false
          };

          try {
            return await msalApplication.acquireTokenSilent(silentRequest);
          } catch (error) {
            // If silent token acquisition fails, fall through to interactive login
            console.error('Silent token acquisition failed, attempting interactive login', error);
          }
        }

        // If we get here, we need to prompt for login
        return await this.loginWithInteraction(defaultScopes);
      }

      // We have an account, try to get token silently
      const silentRequest: SilentRequest = {
        scopes: defaultScopes,
        authority: this.getAuthority(),
        account,
        redirectUri: getCurrentUri(),
        claims: this.claimsAvailable ? this.getClaims() : undefined,
        // Don't force refresh on first attempt
        forceRefresh: false
      };

      try {
        return await msalApplication.acquireTokenSilent(silentRequest);
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          // Token expired or invalid, try with forceRefresh
          try {
            silentRequest.forceRefresh = true;
            return await msalApplication.acquireTokenSilent(silentRequest);
          } catch {
            // Falling back to interactive login as refresh token is expired or invalid
            return await this.loginWithInteraction(defaultScopes);
          }
        }
        throw error;
      }
    } catch (error) {
      // Only throw if it's not an InteractionRequiredAuthError
      if (!(error instanceof InteractionRequiredAuthError)) {
        throw error;
      }

      // For InteractionRequiredAuthError, attempt interactive login
      return await this.loginWithInteraction(defaultScopes);
    }
  }

  private async getAuthResult(scopes: string[] = [], sessionId?: string): Promise<AuthenticationResult> {
    try {
      const silentRequest: SilentRequest = {
        scopes: scopes.length > 0 ? scopes : defaultScopes,
        authority: this.getAuthority(),
        account: this.getAccount(),
        redirectUri: getCurrentUri(),
        claims: this.getClaims()
      };
      const result = await msalApplication.acquireTokenSilent(silentRequest);
      this.storeHomeAccountId(result.account!);
      return result;
    } catch (error: unknown) {
      if (error instanceof InteractionRequiredAuthError || !this.getAccount()) {
        return this.loginWithInteraction(scopes.length > 0 ? scopes : defaultScopes, sessionId);
      }
      if (typeof error === 'string' && signInAuthError(error as string)) {
        this.deleteHomeAccountId();
      }
      throw error;
    }
  }

  private getClaims(): string | undefined {
    const account = this.getAccount();
    if (account && (this.sampleQuery.sampleUrl !== '')) {
      const claimsChallenge = new ClaimsChallenge(this.sampleQuery, account);
      const storedClaims = claimsChallenge.getClaimsFromStorage();
      return storedClaims ? window.atob(storedClaims) : undefined;
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
      claims: this.getClaims(),
      extraQueryParameters: getExtraQueryParameters(),
      tokenQueryParameters: getExtraQueryParameters()
    };

    if (this.consentingToNewScopes || this.performingStepUpAuth) {
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
    } catch (error: unknown) {
      if(error instanceof BrowserAuthError){
        const { errorCode } = error;
        const valid = !this.consentingToNewScopes && errorCode !== 'user_cancelled';
        if (signInAuthError(errorCode) && valid) {
          this.clearSession();
          if (errorCode === 'interaction_in_progress') {
            this.eraseInteractionInProgressCookie();
          }
        }
      }
      throw error;
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
    let cookieKey = '';

    for (const pair of keyValuePairs) {
      cookieKey = pair.substring(0, pair.indexOf('=')).trim();
      if (cookieKey === 'msal.interaction.status' || cookieKey === 'interaction_in_progress') {
        break;
      }
    }
    this.createCookie(cookieKey, '', -100);
  }

  private createCookie(name: string, value: string, days: number): void {
    let expires = ''
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  public clearSession(): void {
    this.clearCache();
    this.deleteHomeAccountId();
    window.sessionStorage.clear();
  }
}

function getExtraQueryParameters(): { [key: string]: string } {
  const params: { [key: string]: string } = {
  };
  getSafeRolloutParameter(params);
  return params;
}

function getSafeRolloutParameter(params: { [key: string]: string; }) {
  const safeRolloutActive = variantService.getFeatureVariables('default', SAFEROLLOUTACTIVE);
  const migrationParam = process.env.REACT_APP_MIGRATION_PARAMETER;
  if (safeRolloutActive && migrationParam) {
    params.safe_rollout = migrationParam;
  }
}

