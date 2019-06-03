import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import jwtDecode from 'jwt-decode';

import hello from 'hellojs';
import { AUTH_URL, DEFAULT_USER_SCOPES } from '../graph-constants';

export class HelloAuthProvider implements AuthenticationProvider {
  public hello: any;

  constructor() {
    const options = {
      authUrl: AUTH_URL,
      clientId: process.env.REACT_APP_CLIENT_ID,
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

    setInterval(() => this.refreshAccessToken(), 1000);
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
    const session = this.hello('msft').getAuthResponse('msft');

    if (session) {
      this.hello('msft').logout();
    }
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

  public async refreshAccessToken() {
      const token = await this.getAccessToken();

      if (!token) {
        return this.signOut();
      }

      const decodedToken: any = jwtDecode(token);
      const currentTime = (new Date()).getTime() / 1000;
      const hasExpired = currentTime > decodedToken.exp;

      const loginProperties = {
        display: 'none',
        response_type: 'token',
        response_mode: 'fragment',
        nonce: 'graph_explorer',
        prompt: 'none',
        scope: DEFAULT_USER_SCOPES,
        login_hint: decodedToken.unique_name,
        domain_hint: 'organizations',
      };

      if (hasExpired) {
        this.hello('msft').login(loginProperties);
      }
  }
}
