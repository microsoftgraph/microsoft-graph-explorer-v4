import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';

import { authenticationWrapper } from '../../../modules/authentication';

export class GraphAuthenticationProvider implements AuthenticationProvider {
  /**
   * getAccessToken
   */
  public async getAccessToken(): Promise<string> {
    try {
      const authResult = await authenticationWrapper.getToken();
      return authResult.accessToken;
    } catch (error) {
      return '';
    }
  }
}
