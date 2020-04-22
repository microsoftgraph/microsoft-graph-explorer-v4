import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';
import { authProvider } from './msal-agent';

export class GraphClient {
  private static client: Client;

  private static createClient(): Client {

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

