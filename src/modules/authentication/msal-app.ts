import { Configuration, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { eventTypes, telemetry } from '../../telemetry';

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
        telemetry.trackEvent(eventTypes.AUTH_REQUEST_EVENT, { message, level });
      },
      piiLoggingEnabled: false
    }
  }
};


const msalApplication = new PublicClientApplication(configuration);
msalApplication.initialize();
export { msalApplication };
