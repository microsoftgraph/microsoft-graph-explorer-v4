import { telemetry, errorTypes } from '../../telemetry';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { Configuration, LogLevel, PublicClientApplication } from '@azure/msal-browser';

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

        const properties = { ComponentName: 'MSAL', Message: message };

        switch (level) {
        case LogLevel.Error:
          telemetry.trackException(
            new Error(errorTypes.OPERATIONAL_ERROR),
            SeverityLevel.Error,
            properties
          );
          return;

        case LogLevel.Info:
          telemetry.trackEvent('MSAL Authentication', {
            ...properties,
            LogLevel: 'Info'
          });
          return;

        case LogLevel.Verbose:
          telemetry.trackEvent('MSAL Trace', {
            ...properties,
            LogLevel: 'Verbose'
          });
          return;

        case LogLevel.Warning:
          telemetry.trackEvent('MSAL Warning', {
            ...properties,
            LogLevel: 'Warning'
          });
          return;
        }
      },
      piiLoggingEnabled: false
    }
  }
};

const msalApplication = new PublicClientApplication(configuration);
msalApplication.initialize();
export { msalApplication };