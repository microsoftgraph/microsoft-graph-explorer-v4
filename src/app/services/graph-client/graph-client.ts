import { Client } from '@microsoft/microsoft-graph-client';
import { HelloAuthProvider } from './HelloAuthProvider';

export class GraphClient {
  private static client: Client;

  private static createClient(): Client {
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
