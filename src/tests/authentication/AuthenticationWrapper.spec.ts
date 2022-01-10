import { AuthenticationWrapper } from '../../../src/modules/authentication/AuthenticationWrapper';

describe('Tests authentication wrapper functions', () => {
  it('Returns null when getSessionId is called with no logged in account', () => {
    const sessionId = new AuthenticationWrapper().getSessionId();
    expect(sessionId).toBeNull();
  });

  it('Throws an error when logIn fails', () => {
    const logIn = new AuthenticationWrapper().logIn();
    expect(logIn).rejects.toThrow();
  });

  it('Throws an error when consenting to scopes fails', () => {
    const consentToScopes = new AuthenticationWrapper().consentToScopes();
    expect(consentToScopes).rejects.toThrow();
  })

  it('Returns undefined when getAccount is called and msalApplication is undefined', () => {
    const account = new AuthenticationWrapper().getAccount();
    expect(account).toBeUndefined();
  })

  it('Throws an error when getToken returns a rejected Promise', () => {
    const getToken = new AuthenticationWrapper().getToken();
    expect(getToken).rejects.toThrow();
  });

  it('Throws an error when getOcpsToken fails ', () => {
    const getOcpsToken = new AuthenticationWrapper().getOcpsToken();
    expect(getOcpsToken).rejects.toThrow();
  })
})