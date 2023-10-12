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
    logoutRedirect: jest.fn(),
    logoutPopup: jest.fn(),
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
    authenticationWrapper.clearCache();
    expect(window.localStorage.removeItem).toHaveBeenCalled();
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
    const account = authenticationWrapper.getAccount();
    expect(account).toBeUndefined();
  })

  it('Log a user in with the appropriate homeAccountId as returned by the auth call', async () => {
    const logIn = await authenticationWrapper.logIn();
    expect(logIn.account!.homeAccountId).toBe('homeAccountId');
  });

  it('get consented scopes along with a valid homeAccountId as returned by the auth call', async () => {
    const consentToScopes = await authenticationWrapper.consentToScopes();
    expect(consentToScopes.account!.homeAccountId).toBe('homeAccountId');
  });

  it('get auth token with a valid homeAccountId as returned by the auth call', async () => {
    const token = await authenticationWrapper.getToken();
    expect(token.account!.homeAccountId).toBe('homeAccountId');
  });
})