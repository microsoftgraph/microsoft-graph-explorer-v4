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
    logoutPopup: jest.fn()
  };

  return {
    msalApplication
  };
})
describe('Tests authentication wrapper functions should', () => {

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
})

describe('Tests authentication wrapper functions should', () => {
  it('throw an error when logIn fails', () => {
    const logIn = authenticationWrapper.logIn();
    expect(logIn).rejects.toThrow();
  });

  it('throw an error when consenting to scopes fails', () => {
    const consentToScopes = authenticationWrapper.consentToScopes();
    expect(consentToScopes).rejects.toThrow();
  });

  it('throw an error when getToken returns a rejected Promise', () => {
    const getToken = authenticationWrapper.getToken();
    expect(getToken).rejects.toBeUndefined();
  });

  describe('throw an error when getOcpsToken fails ', () => {
    it('Throws an error when getOcpsToken fails', () => {
      const getOcpsToken = authenticationWrapper.getOcpsToken();
      expect(getOcpsToken).rejects.toThrow();
    });
  });
});