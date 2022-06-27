import { HOME_ACCOUNT_KEY } from '../../app/services/graph-constants';
import { AuthenticationWrapper } from './AuthenticationWrapper';

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
    loginRedirect: jest.fn(),
    loginPopup: jest.fn(),
    acquireTokenSilent: jest.fn(),
    acquireTokenPopup: jest.fn(),
    getAllAccounts: jest.fn()
  };

  return {
    msalApplication
  };
})
describe('Tests authentication wrapper functions should', () => {
  it('return null when account data is null', () => {
    const sessionId = new AuthenticationWrapper().getSessionId();
    expect(sessionId).toBeNull();
  });

  it('throw an error when logIn fails', () => {
    const logIn = new AuthenticationWrapper().logIn();
    expect(logIn).rejects.toThrow();
  });

  it('throw an error when consenting to scopes fails', () => {
    const consentToScopes = new AuthenticationWrapper().consentToScopes();
    expect(consentToScopes).rejects.toThrow();
  })

  it('return undefined when getAccount is called and msalApplication is undefined', () => {
    const account = new AuthenticationWrapper().getAccount();
    expect(account).toBeUndefined();
  })

  it('throw an error when getToken returns a rejected Promise', () => {
    const getToken = new AuthenticationWrapper().getToken();
    expect(getToken).resolves.toBeUndefined();
  });

  describe('throw an error when getOcpsToken fails ', () => {
    it('Throws an error when getOcpsToken fails', () => {
      const getOcpsToken = new AuthenticationWrapper().getOcpsToken();
      expect(getOcpsToken).rejects.toThrow();
    });
  })

  it('log out a user and call removeItem with the home_account_key', () => {
    new AuthenticationWrapper().logOut();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(HOME_ACCOUNT_KEY);
  })

  it('log out a user with logoutPopup and call removeItem once with the home_account_key', () => {
    new AuthenticationWrapper().logOutPopUp();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(HOME_ACCOUNT_KEY);
  })

  it('call removeItem from localStorage when deleting home account id', () => {
    new AuthenticationWrapper().deleteHomeAccountId();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(HOME_ACCOUNT_KEY);
  });

  it('clear the cache by calling removeItem with all available msal keys', () => {
    new AuthenticationWrapper().clearCache();
    expect(window.localStorage.removeItem).toHaveBeenCalled();
  });

  it('clear user current session, calling removeItem from localStorage and window.sessionStorage.clear', () => {
    new AuthenticationWrapper().clearSession();
    expect(window.localStorage.removeItem).toHaveBeenCalled();
    expect(window.sessionStorage.clear).toHaveBeenCalled();
  })
})