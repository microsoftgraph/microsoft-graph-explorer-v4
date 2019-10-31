import { ImplicitMSALAuthenticationProvider } from
'@microsoft/microsoft-graph-client/lib/src/ImplicitMSALAuthenticationProvider';
import { MSALAuthenticationProviderOptions } from
'@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions';
import { UserAgentApplication } from 'msal';
import { Configuration } from 'msal/lib-commonjs/Configuration';
import { DEFAULT_USER_SCOPES } from '../graph-constants';


const configuration: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID || '',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

const options = new MSALAuthenticationProviderOptions(DEFAULT_USER_SCOPES.split(' '));
export const msalApplication = new UserAgentApplication(configuration);
export const authProvider = new ImplicitMSALAuthenticationProvider(msalApplication, options);
