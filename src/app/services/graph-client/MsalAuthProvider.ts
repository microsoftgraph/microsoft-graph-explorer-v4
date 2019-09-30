import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import { MSALAuthenticationProvider } from '@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProvider';

import { DEFAULT_USER_SCOPES } from '../graph-constants';

export class MsalAuthProvider implements AuthenticationProvider {
  public authProvider: any;
  public userAgentApp: any;
  private loginType = this.getLoginType();
  private defaultUserScopes: string[];

  constructor() {
    const clientId = process.env.REACT_APP_CLIENT_ID || '';
    const options = {
      redirectUri: window.location,
      storeAuthStateInCookie: true,
    };
    this.defaultUserScopes = DEFAULT_USER_SCOPES.split(' ');
    this.authProvider = new MSALAuthenticationProvider(clientId, this.defaultUserScopes, options);
    this.userAgentApp = this.authProvider.userAgentApplication;
  }

  /**
   * @public
   * Checks to see if the token exists in the cache
   * @param {string[]} scopes optional scopes passed to get the token silently
   */
  public getTokenSilent(scopes?: string[]): any {
    const userScopes = scopes || this.defaultUserScopes;
    try {
      const silentToken = this.userAgentApp.acquireTokenSilent(userScopes);
      return silentToken;
    } catch (error) {
      return null;
    }
  }

  /**
   * @public
   * Generates a new access token from passed in scopes
   * @param {string[]} scopes passed to generate token
   */
  public acquireNewAccessToken(scopes: string[] = []) {
    const hasScopes = (scopes.length > 0);
    let listOfScopes = this.defaultUserScopes;
    if (hasScopes) {
      listOfScopes = scopes;
    }
    return this.getTokenSilent(listOfScopes).catch((error: any) => {
      if (this.requiresInteraction(error)) {
        if (this.loginType === 'POPUP') {
          try {
            return this.userAgentApp.acquireTokenPopup(listOfScopes);
          } catch (error) {
            return Promise.resolve(null);
          }
        } else if (this.loginType === 'REDIRECT') {
          this.userAgentApp.acquireTokenRedirect(listOfScopes);
        }
      }
    });
  }

  public async signIn() {
    const loginRequest = this.defaultUserScopes;

    if (this.loginType === 'POPUP') {
      try {
        const response = await this.userAgentApp.loginPopup(loginRequest);
        return response;
      } catch (error) {
        return Promise.resolve(null);
      }
    } else if (this.loginType === 'REDIRECT') {
      await this.userAgentApp.loginRedirect(loginRequest);
    }
  }

  public signOut() {
    this.userAgentApp.logout();
  }

/**
 * @public
 * Gets the token from the cache
 * Called by the graph client before making requests.
 */
  public async getAccessToken(): Promise<any> {
    try {
      const token = await this.authProvider.getAccessToken();
      return token;
    } catch (error) {
      return Promise.resolve(null);
    }
  }

  private requiresInteraction(errorCode: any) {
    if (!errorCode || !errorCode.length) {
      return false;
    }
    return errorCode === 'consent_required' ||
      errorCode === 'interaction_required' ||
      errorCode === 'login_required' ||
      errorCode === 'token_renewal_error';
  }

/**
 * @private
 * Determines whether to load the POPUP/REDIRECT options
 */
  private getLoginType() {
    const userAgent = window.navigator.userAgent;
    const msie = userAgent.indexOf('MSIE ');
    const msie11 = userAgent.indexOf('Trident/');
    const msedge = userAgent.indexOf('Edge/');
    const isIE = msie > 0 || msie11 > 0;
    const isEdge = msedge > 0;
    return isIE || isEdge ? 'REDIRECT' : 'POPUP';
  }

}
