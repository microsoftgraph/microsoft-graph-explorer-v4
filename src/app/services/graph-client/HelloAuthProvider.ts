import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import hello from 'hellojs';
import { AUTH_URL, DEFAULT_USER_SCOPES } from '../constants';

export class HelloAuthProvider implements AuthenticationProvider {
  private hello: any;

  constructor() {
    const options = {
      authUrl: AUTH_URL,
      clientId: 'cb2d7367-7429-41c6-ab18-6ecb336139a6',
    };

    this.hello = hello;

    this.hello.init({
      msft: {
        oauth: {
          version: 2,
          auth: options.authUrl + '/common/oauth2/v2.0/authorize',
          grant: options.authUrl + '/common/oauth2/v2.0/token',
        },
        scope_delim: ' ',

        // Don't even try submitting via form.
        // This means no POST operations in <=IE9
        form: false,
      }, msft_admin_consent: {
        oauth: {
          version: 2,
          auth: options.authUrl + '/common/adminconsent',
          grant: options.authUrl + '/common/oauth2/v2.0/token',
        },
        scope_delim: ' ',

        // Don't even try submitting via form.
        // This means no POST operations in <=IE9
        form: false,
      },
    } as any);

    this.hello.init({
      msft: options.clientId,
      msft_admin_consent: options.clientId,
    }, {
      redirect_uri: window.location.pathname,
      scope: DEFAULT_USER_SCOPES,
    });
  }

  public signIn() {
    const loginProperties = {
      display: 'page',
      state: 'abcd',
      nonce: 'graph_explorer',
    };

    // @ts-ignore
    this.hello('msft').login(loginProperties);
  }

  public signOut() {
    this.hello('msft').logout();
  }

  public  getAccessToken(): Promise<any> {
    try {
      const accessToken = this.hello('msft')
        .getAuthResponse('msft')
        .access_token;
      return Promise.resolve(accessToken);
    } catch (error) {
      return Promise.resolve(null);
    }
  }
}
