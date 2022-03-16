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
  account: authenticationWrapper.getAccount()!,
  interactionType: InteractionType.Popup ,
  scopes
}

export const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalApplication, msalAuthOptions);
