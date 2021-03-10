import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';

import { AuthenticationModule } from './authentication-module';

export class CustomAuthenticationProvider implements AuthenticationProvider {
  /**
   * getAccessToken
   */
  public async getAccessToken(): Promise<string> {
    try {
      const authResult = await AuthenticationModule.getInstance().getToken();
      return authResult.accessToken;
    } catch (error) {
      throw error;
    }
  }
}
