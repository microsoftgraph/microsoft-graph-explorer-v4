import { Configuration, EventMessage, EventType, LogLevel, PublicClientApplication } from '@azure/msal-browser';

function getClientIdFromWindow() {
  return window?.ClientId ?? '';
}

function getClientIdFromEnv() {
  return process.env?.REACT_APP_CLIENT_ID ?? '';
}

const windowHasClientId = getClientIdFromWindow();
const clientId = windowHasClientId ? getClientIdFromWindow() : getClientIdFromEnv();
export const configuration: Configuration = {
  auth: {
    clientId,
    clientCapabilities: ['CP1']
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
    claimsBasedCachingEnabled: true
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Verbose,
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
      },
      piiLoggingEnabled: false
    }
  }
};


const msalApplication = new PublicClientApplication(configuration);
msalApplication.initialize();
msalApplication.addEventCallback((message: EventMessage) => {
  console.log('MSAL Log:', message);

});
export { msalApplication };
