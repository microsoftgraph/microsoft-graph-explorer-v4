import {
  AccountInfo,
  AuthenticationResult, InteractionRequiredAuthError,
  PopupRequest, PublicClientApplication, SilentRequest
} from '@azure/msal-browser';

import { geLocale } from '../../../../appLocale';
import { AUTH_URL, DEFAULT_USER_SCOPES } from '../../graph-constants';

const defaultScopes = DEFAULT_USER_SCOPES.split(' ');

export class AuthenticationModule {

  private msalApplication: PublicClientApplication;

  constructor(msalApplication: PublicClientApplication) {
    this.msalApplication = msalApplication;
  }

  public getAccount(): AccountInfo | undefined {
    if (this.msalApplication) {
      const allAccounts = this.msalApplication.getAllAccounts();
      if (allAccounts && allAccounts.length > 0) {
        return allAccounts[0];
      }
    }
    return undefined;
  }

  public async getToken() {
    const silentRequest = {
      scopes: defaultScopes,
      authority: this.getAuthority(),
      account: this.getAccount()
    };
    const authResponse = await this.msalApplication.acquireTokenSilent(silentRequest);
    return authResponse;
  }

  public async getAuthResult(scopes: string[] = [], sessionId?: string): Promise<AuthenticationResult> {
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
        return this.loginWithInteraction(userScopes, sessionId);
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

  private async loginWithInteraction(userScopes: string[], sessionId?: string) {
    const popUpRequest: PopupRequest = {
      scopes: userScopes,
      authority: this.getAuthority(),
      prompt: 'select_account',
      redirectUri: this.getCurrentUri(),
      extraQueryParameters: { mkt: geLocale }
    };

    if (sessionId) {
      popUpRequest.sid = sessionId;
    }

    try {
      const authResponse: AuthenticationResult = await this.msalApplication.loginPopup(popUpRequest);
      return authResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * get current uri for redirect uri purpose
   * ref - https://github.com/AzureAD/microsoft-authentication-library-for
   * -js/blob/9274fac6d100a6300eb2faa4c94aa2431b1ca4b0/lib/msal-browser/src/utils/BrowserUtils.ts#L49
   */
  private getCurrentUri(): string {
    const currentUrl = window.location.href.split('?')[0].split('#')[0];
    return currentUrl.toLowerCase();
  }
}
