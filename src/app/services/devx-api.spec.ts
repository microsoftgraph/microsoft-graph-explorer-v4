jest.mock('../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn() }
}));

import { authenticationWrapper } from '../../modules/authentication';
import {
  defaultDevxConfiguration, fetchDevxApi, getDevxAccount, getDevxConfiguration, normalizeDevxUrl
} from './devx-api';

describe('DevX configuration', () => {
  const getAccount = authenticationWrapper.getAccount as jest.Mock;

  beforeEach(() => { jest.clearAllMocks(); fetchMock.resetMocks(); });

  it.each(['https://api.example/path/?', 'https://api.example/#', 'http://api.example',
    '/api', '', 'https://user:password@api.example', 'https://api.example/?x=1'])(
    'rejects invalid base URL %s', value => { expect(normalizeDevxUrl(value)).toBeNull(); }
  );

  it('normalizes an HTTPS base path', () => {
    expect(normalizeDevxUrl(' https://api.example/service/// ')).toBe('https://api.example/service');
  });

  it.each([
    ['alias@microsoft.com', true], ['Alias@MICROSOFT.COM', true], ['alias@sub.microsoft.com', false],
    ['alias@microsoft.com.example', false], ['alias@notmicrosoft.com', false], ['microsoft.com', false],
    ['alias@example.com', false], ['a@b@microsoft.com', false]
  ])('uses the exact username domain for %s', (username, eligible) => {
    getAccount.mockReturnValue({ username, homeAccountId: 'account', tenantId: 'tenant' });
    expect(getDevxAccount(true).eligible).toBe(eligible);
    expect(getDevxAccount(false).eligible).toBe(false);
  });

  it('does not use custom settings for an anonymous or different account', () => {
    getAccount.mockReturnValue({ username: 'alias@microsoft.com', homeAccountId: 'new', tenantId: 'tenant' });
    const config = {
      baseUrl: 'https://custom.example', org: 'org', branchName: 'main', custom: true, accountKey: 'old:tenant'
    };
    expect(getDevxConfiguration({ devxApi: config, auth: { authToken: { token: true } } }).baseUrl)
      .toBe(defaultDevxConfiguration().baseUrl);
    expect(getDevxConfiguration({ devxApi: config }).baseUrl).toBe(defaultDevxConfiguration().baseUrl);
  });

  it('encodes source parameters only for samples/permissions and always rejects redirects', async () => {
    fetchMock.mockResponse('{}');
    const config = { baseUrl: 'https://custom.example/path', custom: true, org: 'a & b', branchName: 'feature/a' };
    await fetchDevxApi(config, '/samples', {}, { redirect: 'follow' });
    await fetchDevxApi(config, '/permissions', { scopeType: 'DelegatedWork' });
    await fetchDevxApi(config, '/openapi/tree', { graphVersions: 'beta' });
    const urls = fetchMock.mock.calls.map(([url]) => new URL(url as string));
    expect(urls[0].pathname).toBe('/path/samples');
    expect(urls[0].searchParams.get('org')).toBe('a & b');
    expect(urls[1].searchParams.get('branchName')).toBe('feature/a');
    expect(urls[2].searchParams.has('org')).toBe(false);
    expect(urls[2].searchParams.get('graphVersions')).toBe('beta');
    fetchMock.mock.calls.forEach(([, options]) => expect(options?.redirect).toBe('error'));
  });
});
