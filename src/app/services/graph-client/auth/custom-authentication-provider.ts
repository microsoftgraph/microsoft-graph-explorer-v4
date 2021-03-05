import { PublicClientApplication } from '@azure/msal-browser';
import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';

import { AuthModule } from './authentication';

export class CustomAuthenticationProvider implements AuthenticationProvider {

  private msalApplication: PublicClientApplication;

  constructor(msalApplication: PublicClientApplication) {
    this.msalApplication = msalApplication;
  }

  /**
   * getAccessToken
   */
  public async getAccessToken(): Promise<string> {
    try {
      const authModule = new AuthModule(this.msalApplication);
      const authResult = await authModule.getAuthResult();
      return authResult.accessToken;
    } catch (error) {
      throw error;
    }
  }
}