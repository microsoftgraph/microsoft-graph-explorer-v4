import { InteractionType } from '@azure/msal-browser';
import {
  AuthCodeMSALBrowserAuthenticationProvider,
  AuthCodeMSALBrowserAuthenticationProviderOptions
} from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { authenticationWrapper } from '../../../modules/authentication';
import { msalApplication } from '../../../modules/authentication/msal-app';
import { DEFAULT_USER_SCOPES } from '../graph-constants';

export { GraphClient } from './graph-client';

const scopes = DEFAULT_USER_SCOPES.split(' ');

const msalAuthOptions:AuthCodeMSALBrowserAuthenticationProviderOptions = {
  account: authenticationWrapper.getAccount()!, // the AccountInfo instance to acquire the token for.
  interactionType: InteractionType.Popup , // msal-browser InteractionType
  scopes // example of the scopes to be passed
}

export const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalApplication, msalAuthOptions);


