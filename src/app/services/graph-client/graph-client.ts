import { Client } from '@microsoft/microsoft-graph-client';
import { MSALAuthenticationProvider } from '@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProvider';
import { DEFAULT_USER_SCOPES } from '../constants';
import { HelloAuthProvider } from './HelloAuthProvider';

export class GraphClient {
  private static client: Client;

  private static createClient(): Client {
    const clientId = 'cb2d7367-7429-41c6-ab18-6ecb336139a6';
    const graphScopes = [DEFAULT_USER_SCOPES];
    const options = {
      redirectUri: window.location,
      cacheLocation: 'localStorage'
    };
    const authProvider = new HelloAuthProvider();

    const clientOptions = {
      authProvider,
    };

    return Client.initWithMiddleware(clientOptions);
  }

  public static getInstance(): Client {
    if (!GraphClient.client) {
      GraphClient.client = this.createClient();
    }
    return GraphClient.client;
  }
}
