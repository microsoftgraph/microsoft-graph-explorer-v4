import { PublicClientApplication } from '@azure/msal-browser';
import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';

import { AuthenticationModule } from './authentication-module';

export class CustomAuthenticationProvider implements AuthenticationProvider {

  private readonly msalApplication: PublicClientApplication;

  constructor(msalApplication: PublicClientApplication) {
    this.msalApplication = msalApplication;
  }

  /**
   * getAccessToken
   */
  public async getAccessToken(): Promise<string> {
    try {
      const authModule = new AuthenticationModule(this.msalApplication);
      const authResult = await authModule.getAuthResult();
      return authResult.accessToken;
    } catch (error) {
      throw error;
    }
  }
}
