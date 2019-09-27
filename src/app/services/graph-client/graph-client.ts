import { Client } from '@microsoft/microsoft-graph-client';
import { MsalAuthProvider } from './MsalAuthProvider';

export class GraphClient {
  private static client: Client;

  private static createClient(): Client {
    const authProvider = new MsalAuthProvider();

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
