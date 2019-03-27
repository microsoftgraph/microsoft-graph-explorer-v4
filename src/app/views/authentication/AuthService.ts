import { MSALAuthenticationProvider } from '@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProvider';
import { DEFAULT_USER_SCOPES } from '../../services/constants';

const clientId = 'cb2d7367-7429-41c6-ab18-6ecb336139a6';
const graphScopes = [DEFAULT_USER_SCOPES];
const options = { redirectUri: window.location };
const authProvider = new MSALAuthenticationProvider(clientId, graphScopes, options);

export async function getAccessToken() {
    try {
      const accessToken = await authProvider.getAccessToken();
      return accessToken;
    } catch (error) {
      throw error;
    }
}

export function logOut() {
    localStorage.setItem('authenticatedUser', JSON.stringify({
        status: false,
        token: null,
      }));
}
