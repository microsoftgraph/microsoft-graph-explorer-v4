jest.mock('../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackException: jest.fn() },
  errorTypes: { OPERATIONAL_ERROR: 'OPERATIONAL_ERROR' }
}));

jest.mock('@azure/msal-browser', () => ({
  LogLevel: { Error: 0, Warning: 1, Info: 2, Verbose: 3 },
  BrowserCacheLocation: { LocalStorage: 'localStorage' },
  PublicClientApplication: jest.fn().mockImplementation(() => ({
    initialize: jest.fn().mockResolvedValue(undefined)
  }))
}));

describe('msal-app', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('exports a configuration object', () => {
    const { configuration } = require('./msal-app');
    expect(configuration).toBeDefined();
    expect(configuration.auth).toBeDefined();
    expect(configuration.cache).toBeDefined();
    expect(configuration.system).toBeDefined();
  });

  it('exports msalApplication instance', () => {
    const { msalApplication } = require('./msal-app');
    expect(msalApplication).toBeDefined();
  });

  it('exports initializeMsal function', () => {
    const { initializeMsal } = require('./msal-app');
    expect(typeof initializeMsal).toBe('function');
  });

  it('initializeMsal resolves successfully', async () => {
    const { initializeMsal } = require('./msal-app');
    await expect(initializeMsal()).resolves.toBeUndefined();
  });

  it('configuration uses localStorage for cache', () => {
    const { configuration } = require('./msal-app');
    expect(configuration.cache.cacheLocation).toBe('localStorage');
    expect(configuration.cache.storeAuthStateInCookie).toBe(true);
  });

  it('configuration includes client capabilities', () => {
    const { configuration } = require('./msal-app');
    expect(configuration.auth.clientCapabilities).toEqual(['CP1']);
  });

  it('initializeMsal rejects when msal initialize fails', async () => {
    jest.resetModules();
    jest.doMock('@azure/msal-browser', () => ({
      LogLevel: { Error: 0, Warning: 1, Info: 2, Verbose: 3 },
      BrowserCacheLocation: { LocalStorage: 'localStorage' },
      PublicClientApplication: jest.fn().mockImplementation(() => ({
        initialize: jest.fn().mockRejectedValue(new Error('MSAL init failed'))
      }))
    }));
    const { initializeMsal } = require('./msal-app');
    await expect(initializeMsal()).rejects.toThrow('MSAL init failed');
  });

  it('logger callback handles Error level', () => {
    const { telemetry } = require('../../telemetry');
    const { configuration } = require('./msal-app');
    const { LogLevel } = require('@azure/msal-browser');
    const loggerCallback = configuration.system.loggerOptions.loggerCallback;

    loggerCallback(LogLevel.Error, 'test error message', false);
    expect(telemetry.trackException).toHaveBeenCalled();
  });

  it('logger callback handles Info level', () => {
    const { telemetry } = require('../../telemetry');
    const { configuration } = require('./msal-app');
    const { LogLevel } = require('@azure/msal-browser');
    const loggerCallback = configuration.system.loggerOptions.loggerCallback;

    telemetry.trackEvent.mockClear();
    loggerCallback(LogLevel.Info, 'test info message', false);
    expect(telemetry.trackEvent).toHaveBeenCalledWith(
      'MSAL Authentication', expect.objectContaining({ LogLevel: 'Info' })
    );
  });

  it('logger callback handles Warning level', () => {
    const { telemetry } = require('../../telemetry');
    const { configuration } = require('./msal-app');
    const { LogLevel } = require('@azure/msal-browser');
    const loggerCallback = configuration.system.loggerOptions.loggerCallback;

    telemetry.trackEvent.mockClear();
    loggerCallback(LogLevel.Warning, 'test warning', false);
    expect(telemetry.trackEvent).toHaveBeenCalledWith('MSAL Warning', expect.objectContaining({ LogLevel: 'Warning' }));
  });

  it('logger callback handles Verbose level', () => {
    const { telemetry } = require('../../telemetry');
    const { configuration } = require('./msal-app');
    const { LogLevel } = require('@azure/msal-browser');
    const loggerCallback = configuration.system.loggerOptions.loggerCallback;

    telemetry.trackEvent.mockClear();
    loggerCallback(LogLevel.Verbose, 'trace message', false);
    expect(telemetry.trackEvent).toHaveBeenCalledWith('MSAL Trace', expect.objectContaining({ LogLevel: 'Verbose' }));
  });

  it('logger callback does not log when containsPii is true', () => {
    const { telemetry } = require('../../telemetry');
    const { configuration } = require('./msal-app');
    const { LogLevel } = require('@azure/msal-browser');
    const loggerCallback = configuration.system.loggerOptions.loggerCallback;

    telemetry.trackEvent.mockClear();
    telemetry.trackException.mockClear();
    loggerCallback(LogLevel.Error, 'pii message', true);
    expect(telemetry.trackException).not.toHaveBeenCalled();
    expect(telemetry.trackEvent).not.toHaveBeenCalled();
  });

  it('configuration has piiLoggingEnabled set to false', () => {
    const { configuration } = require('./msal-app');
    expect(configuration.system.loggerOptions.piiLoggingEnabled).toBe(false);
  });
});
