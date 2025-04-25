import { authenticationWrapper } from '.';
import { HOME_ACCOUNT_KEY } from '../../app/services/graph-constants';

window.open = jest.fn();
jest.spyOn(window.sessionStorage.__proto__, 'clear');

jest.spyOn(window.localStorage.__proto__, 'setItem');
jest.spyOn(window.localStorage.__proto__, 'getItem');
jest.spyOn(window.localStorage.__proto__, 'removeItem');

jest.mock('./msal-app.ts', () => {
  const msalApplication = {
    account: null,
    getAccount: jest.fn(),
    getAccountByHomeId: jest.fn((id) => ({
      homeAccountId: id,
      environment: 'environment',
      tenantId: 'tenantId',
      username: 'username',
      idTokenClaims: { sid: 'test-sid', login_hint: 'user@example.com' }
    })),
    logoutRedirect: jest.fn(),
    logoutPopup: jest.fn(),
    // Mock getAllAccounts but don't set a default return value
    // Each test will configure this as needed
    getAllAccounts: jest.fn(),
    loginPopup: jest.fn(() => {
      return Promise.resolve({
        account: {
          homeAccountId: 'homeAccountId',
          environment: 'environment',
          tenantId: 'tenantId',
          username: 'username'
        }
      })
    }),
    acquireTokenSilent: jest.fn(() => {
      return Promise.resolve({
        account: {
          homeAccountId: 'homeAccountId',
          environment: 'environment',
          tenantId: 'tenantId',
          username: 'username'
        }
      })
    })
  };

  return {
    msalApplication
  };
})
describe('AuthenticationWrapper should', () => {

  const mockAccount = {
    homeAccountId: 'homeAccountId',
    environment: 'environment',
    tenantId: 'tenantId',
    username: 'username'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set default mock implementation for most tests
    const { msalApplication } = require('./msal-app.ts');
    msalApplication.getAllAccounts.mockReturnValue([mockAccount]);
  });

  it('log out a user and call removeItem with the home_account_key', () => {
    authenticationWrapper.logOut();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(HOME_ACCOUNT_KEY);
  })

  it('log out a user with logoutPopup and call removeItem once with the home_account_key', () => {
    authenticationWrapper.logOutPopUp();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(HOME_ACCOUNT_KEY);
  })

  it('call removeItem from localStorage when deleting home account id', () => {
    authenticationWrapper.deleteHomeAccountId();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(HOME_ACCOUNT_KEY);
  });

  it('clear the cache by calling removeItem with all available msal keys', () => {
    // Mock the environment to have MSAL keys in localStorage

    // First save original implementation of localStorage methods
    const originalGetItem = window.localStorage.getItem;
    const originalKeys = Object.keys;

    // Mock Object.keys to return MSAL-like keys when called on localStorage
    Object.keys = jest.fn().mockImplementation((obj) => {
      if (obj === localStorage) {
        return ['homeAccountId-login.windows.net-idtoken', 'other-key'];
      }
      return originalKeys(obj);
    });

    // Make sure getHomeAccountId returns a value that will match our keys
    jest.spyOn(window.localStorage, 'getItem').mockImplementation((key) => {
      if (key === HOME_ACCOUNT_KEY) {
        return 'homeAccountId';
      }
      return originalGetItem.call(window.localStorage, key);
    });

    authenticationWrapper.clearCache();

    // Verify removeItem was called with the expected key
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('homeAccountId-login.windows.net-idtoken');

    // Restore original implementations
    Object.keys = originalKeys;
    jest.spyOn(window.localStorage, 'getItem').mockRestore();
  });

  it('clear user current session, calling removeItem from localStorage and window.sessionStorage.clear', () => {
    authenticationWrapper.clearSession();
    expect(window.localStorage.removeItem).toHaveBeenCalled();
    expect(window.sessionStorage.clear).toHaveBeenCalled();
  })

  it('return null when account data is null', () => {
    const sessionId = authenticationWrapper.getSessionId();
    expect(sessionId).toBeNull();
  });

  it('return undefined when getAccount is called and number of accounts is zero', () => {
    const { msalApplication } = require('./msal-app.ts');
    msalApplication.getAllAccounts.mockReturnValueOnce([]);
    const account = authenticationWrapper.getAccount();
    expect(account).toBeUndefined();
  });

  it('Log a user in with the appropriate homeAccountId as returned by the auth call', async () => {
    const logIn = await authenticationWrapper.logIn();
    expect(logIn.account!.homeAccountId).toBe('homeAccountId');
  });

  it('get consented scopes along with a valid homeAccountId as returned by the auth call', async () => {
    const { msalApplication } = require('./msal-app.ts');
    msalApplication.getAllAccounts.mockReturnValue([mockAccount]);
    const consentToScopes = await authenticationWrapper.consentToScopes();
    expect(consentToScopes.account!.homeAccountId).toBe('homeAccountId');
  });

  it('get auth token with a valid homeAccountId as returned by the auth call', async () => {
    const { msalApplication } = require('./msal-app.ts');
    msalApplication.getAllAccounts.mockReturnValue([mockAccount]);
    const token = await authenticationWrapper.getToken();
    expect(token.account!.homeAccountId).toBe('homeAccountId');
  });
})