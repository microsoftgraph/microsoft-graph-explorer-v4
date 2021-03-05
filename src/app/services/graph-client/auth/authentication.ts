import {
  AccountInfo,
  AuthenticationResult, InteractionRequiredAuthError,
  PopupRequest, PublicClientApplication, SilentRequest
} from '@azure/msal-browser';

import { geLocale } from '../../../../appLocale';
import { AUTH_URL, DEFAULT_USER_SCOPES } from '../../graph-constants';

const defaultScopes = DEFAULT_USER_SCOPES.split(' ');

export class AuthModule {

  private msalApplication: PublicClientApplication;

  constructor(msalApplication: PublicClientApplication) {
    this.msalApplication = msalApplication;
  }

  private getAccount(): AccountInfo | undefined {
    const activeAccount = this.msalApplication.getActiveAccount();
    if (activeAccount) {
      return activeAccount;
    }
    return undefined;
  }

  public async getAuthResult(scopes: string[] = []): Promise<AuthenticationResult> {
    const userScopes = (scopes.length > 0) ? scopes : defaultScopes;
    const silentRequest: SilentRequest = {
      scopes: userScopes,
      authority: this.getAuthority(),
      account: this.getAccount()
    };

    try {
      const authResponse: AuthenticationResult = await this.msalApplication.acquireTokenSilent(silentRequest);
      return authResponse;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError || this.getAccount() === undefined) {
        return this.loginWithInteraction(userScopes);
      } else {
        throw error;
      }
    }
  }

  private getAuthority(): string {
    // support for tenanted endpoint
    const urlParams = new URLSearchParams(location.search);
    let tenant = urlParams.get('tenant');

    if (tenant === null) {
      tenant = 'common';
    }

    return `${AUTH_URL}/${tenant}/`;
  }

  private async loginWithInteraction(userScopes: string[]) {
    const popUpRequest: PopupRequest = {
      scopes: userScopes,
      authority: this.getAuthority(),
      prompt: 'select_account',
      redirectUri: this.getCurrentUri(),
      extraQueryParameters: { mkt: geLocale }
    };

    try {
      const authResponse: AuthenticationResult = await this.msalApplication.loginPopup(popUpRequest);
      return authResponse;
    } catch (error) {
      throw error;
    }
  }

  private getCurrentUri(): string {
    const currentUrl = window.location.href.split('?')[0].split('#')[0];
    return currentUrl.toLowerCase();
  }
}
