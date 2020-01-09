import { ImplicitMSALAuthenticationProvider } from
  '@microsoft/microsoft-graph-client/lib/src/ImplicitMSALAuthenticationProvider';
import { MSALAuthenticationProviderOptions } from
  '@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions';
import { UserAgentApplication } from 'msal';
import { Configuration } from 'msal/lib-commonjs/Configuration';
import { DEFAULT_USER_SCOPES } from '../graph-constants';

function getClientIdFromWindow() {
  return (window as any).ClientId;
}

function getClientIdFromEnv() {
  return process.env.REACT_APP_CLIENT_ID;
}

const windowHasClientId = getClientIdFromWindow();
const clientId = windowHasClientId ? getClientIdFromWindow() : getClientIdFromEnv();

const configuration: Configuration = {
  auth: {
    clientId
  },
  cache: {
    storeAuthStateInCookie: true,
  },
};

const options = new MSALAuthenticationProviderOptions(DEFAULT_USER_SCOPES.split(' '));
export const msalApplication = new UserAgentApplication(configuration);
export const authProvider = new ImplicitMSALAuthenticationProvider(msalApplication, options);
