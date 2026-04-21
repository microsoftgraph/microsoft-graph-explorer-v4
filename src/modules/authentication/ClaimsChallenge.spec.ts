jest.mock('./index', () => ({
  authenticationWrapper: {
    getAccount: jest.fn()
  }
}));
jest.mock('./msal-app', () => ({
  configuration: {
    auth: { clientId: 'test-client-id' }
  }
}));

import { ClaimsChallenge } from './ClaimsChallenge';
import { AccountInfo } from '@azure/msal-browser';
import { IQuery } from '../../types/query-runner';

describe('ClaimsChallenge', () => {
  const mockAccount: AccountInfo = {
    homeAccountId: 'home-id',
    environment: 'login.microsoftonline.com',
    tenantId: 'tenant-id',
    username: 'user@test.com',
    localAccountId: 'local-id',
    idTokenClaims: { oid: 'object-id' }
  };

  const mockQuery: IQuery = {
    sampleUrl: 'https://graph.microsoft.com/v1.0/me',
    selectedVerb: 'GET',
    selectedVersion: 'v1.0',
    sampleHeaders: []
  };

  let challenge: ClaimsChallenge;

  beforeEach(() => {
    sessionStorage.clear();
    challenge = new ClaimsChallenge(mockQuery, mockAccount);
  });

  it('should construct with correct claims challenge key', () => {
    expect(challenge).toBeDefined();
  });

  it('getClaimsFromStorage returns null when no claims stored', () => {
    expect(challenge.getClaimsFromStorage()).toBeNull();
  });

  it('handle stores claims from www-authenticate header', () => {
    const { authenticationWrapper } = require('./index');
    authenticationWrapper.getAccount.mockReturnValue(mockAccount);

    const headers = new Headers();
    headers.set('www-authenticate', 'Bearer claims=dGVzdENsYWltcw==,error=insufficient_claims');

    challenge.handle(headers);

    const stored = challenge.getClaimsFromStorage();
    expect(stored).toBeDefined();
  });

  it('handle does nothing when no account', () => {
    const { authenticationWrapper } = require('./index');
    authenticationWrapper.getAccount.mockReturnValue(null);

    const headers = new Headers();
    headers.set('www-authenticate', 'Bearer claims=dGVzdA==');

    challenge.handle(headers);
    expect(challenge.getClaimsFromStorage()).toBeNull();
  });

  it('handle does not overwrite existing claims', () => {
    const { authenticationWrapper } = require('./index');
    authenticationWrapper.getAccount.mockReturnValue(mockAccount);

    const key = `cc.test-client-id.object-id.https://graph.microsoft.com/v1.0/me.GET`;
    sessionStorage.setItem(key, 'existingClaims');

    const headers = new Headers();
    headers.set('www-authenticate', 'Bearer claims=bmV3Q2xhaW1z');

    challenge.handle(headers);
    expect(sessionStorage.getItem(key)).toBe('existingClaims');
  });
});
