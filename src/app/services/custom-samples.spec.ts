jest.mock('../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn() }
}));
jest.mock('../../modules/cache/samples.cache', () => ({
  samplesCache: { readSamples: jest.fn().mockResolvedValue([]), saveSamples: jest.fn().mockResolvedValue(undefined) }
}));
jest.mock('../../modules/cache/resources.cache', () => ({
  resourcesCache: {
    readResources: jest.fn().mockResolvedValue(null), saveResources: jest.fn().mockResolvedValue(undefined)
  }
}));
jest.mock('../../modules/suggestions/cache-provider', () => ({
  getSuggestionsFromCache: jest.fn().mockResolvedValue(null), storeSuggestionsInCache: jest.fn()
}));
jest.mock('../utils/open-api-parser', () => ({
  parseOpenApiResponse: jest.fn(() => ({ parameters: [], url: 'users', version: 'v1.0' }))
}));

import { configureStore } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/react';
import { authenticationWrapper } from '../../modules/authentication';
import { samplesCache } from '../../modules/cache/samples.cache';
import { resourcesCache } from '../../modules/cache/resources.cache';
import devxMiddleware from '../middleware/devxMiddleware';
import { applyCustomSamples, resetCustomSamples } from './custom-samples';
import { defaultDevxConfiguration } from './devx-api';
import auth, { getAuthTokenSuccess, signOutSuccess } from './slices/auth.slice';
import devxApi from './slices/devxapi.slice';
import samples, { fetchSamples } from './slices/samples.slice';
import resources, { fetchResources } from './slices/resources.slice';
import scopes, { fetchScopes } from './slices/scopes.slice';
import snippets, { getSnippet } from './slices/snippet.slice';
import autoComplete, { fetchAutoCompleteOptions } from './slices/autocomplete.slice';

const query = {
  sampleUrl: 'https://graph.microsoft.com/beta/users?$select=id', selectedVerb: 'POST',
  selectedVersion: 'beta', sampleHeaders: [{ name: 'Prefer', value: 'test' }], sampleBody: { displayName: 'Example' }
};
const account = { username: 'alias@microsoft.com', homeAccountId: 'account', tenantId: 'tenant' };
const input = { baseUrl: 'https://custom.example', org: 'org & name', branchName: 'feature/a' };
const sample = { category: 'Tests', humanName: 'Example', method: 'GET', requestUrl: '/v1.0/users' };
const tree = { segment: '/', labels: [], children: [] };
const response = (data: unknown) => ({ ok: true, json: async () => data, text: async () => 'generated snippet' });

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

function createStore() {
  const store = configureStore({
    reducer: {
      auth, devxApi, samples, resources, scopes, snippets, autoComplete,
      sampleQuery: () => query, profile: () => ({ user: { profileType: 'Member' } })
    },
    middleware: getDefault => getDefault({ serializableCheck: false }).concat(devxMiddleware as any)
  });
  store.dispatch(getAuthTokenSuccess());
  return store;
}

describe('Custom samples lifecycle', () => {
  const getAccount = authenticationWrapper.getAccount as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    getAccount.mockReturnValue(account);
    global.fetch = jest.fn(async (url: RequestInfo | URL) => {
      const path = new URL(String(url)).pathname;
      if (path.endsWith('/samples')) { return response({ sampleQueries: [sample] }); }
      if (path.endsWith('/openapi/tree')) { return response(tree); }
      return response([]);
    }) as jest.Mock;
  });

  it('stages core data, changes every consumer, and preserves Graph request and snippet language', async () => {
    const store = createStore();
    const beforeQuery = store.getState().sampleQuery;
    await store.dispatch(applyCustomSamples(input) as any);
    expect(store.getState().devxApi.custom).toBe(true);
    expect(store.getState().samples.queries).toEqual([sample]);
    expect(store.getState().resources.data).toEqual({ 'v1.0': tree, beta: tree });
    await store.dispatch(fetchScopes('query') as any);
    await store.dispatch(fetchScopes('full') as any);
    await store.dispatch(getSnippet('python') as any);
    await store.dispatch(fetchAutoCompleteOptions({ url: 'users', version: 'v1.0', context: 'parameters' }) as any);
    const urls = (global.fetch as jest.Mock).mock.calls.map(([url]) => new URL(url));
    expect(new Set(urls.map(url => url.origin))).toEqual(new Set(['https://custom.example']));
    expect(urls.map(url => url.pathname)).toEqual(expect.arrayContaining([
      '/samples', '/permissions', '/openapi/tree', '/api/graphexplorersnippets', '/openapi'
    ]));
    urls.forEach(url => {
      const hasSource = ['/samples', '/permissions'].includes(url.pathname);
      expect(url.searchParams.get('org')).toBe(hasSource ? input.org : null);
      expect(url.searchParams.get('branchName')).toBe(hasSource ? input.branchName : null);
    });
    (global.fetch as jest.Mock).mock.calls.forEach(([, options]) => expect(options.redirect).toBe('error'));
    expect(store.getState().sampleQuery).toEqual(beforeQuery);
    expect(store.getState().snippets.snippetTab).toBe('csharp');
  });

  it.each([
    ['default', 'pending'], ['custom', 'pending'], ['default', 'rejected'], ['custom', 'rejected']
  ])('loads %s data without waiting for %s cache writes', async (source, cacheState) => {
    const writes = deferred<void>();
    const save = () => cacheState === 'pending' ? writes.promise : Promise.reject(new Error('Cache unavailable'));
    (samplesCache.saveSamples as jest.Mock).mockImplementationOnce(save);
    (resourcesCache.saveResources as jest.Mock).mockImplementationOnce(save).mockImplementationOnce(save);
    const store = createStore();
    const request = source === 'custom' ? store.dispatch(applyCustomSamples(input) as any)
      : Promise.all([store.dispatch(fetchSamples() as any), store.dispatch(fetchResources() as any)]);
    try {
      await waitFor(() => {
        expect(store.getState().samples.queries).toEqual([sample]);
        expect(store.getState().samples.pending).toBe(false);
        expect(store.getState().resources.data).toEqual({ 'v1.0': tree, beta: tree });
        expect(store.getState().resources.pending).toBe(false);
      });
      expect(store.getState().devxApi.custom).toBe(source === 'custom');
      expect(store.getState().samples.error).toBeNull();
      expect(store.getState().resources.error).toBeNull();
      const config = source === 'custom' ? expect.objectContaining({ ...input, custom: true })
        : defaultDevxConfiguration();
      expect(samplesCache.saveSamples).toHaveBeenCalledWith([sample], config);
      expect(resourcesCache.saveResources).toHaveBeenCalledWith(tree, 'v1.0', config);
      expect(resourcesCache.saveResources).toHaveBeenCalledWith(tree, 'beta', config);
    } finally {
      writes.resolve();
      await request;
    }
  });

  it.each(['/samples', '/openapi/tree?v1.0', '/openapi/tree?beta'])(
    'keeps defaults and exposes an error when candidate loading fails for %s', async failedEndpoint => {
      const store = createStore();
      await store.dispatch(fetchSamples() as any);
      const previousSamples = store.getState().samples.queries;
      (global.fetch as jest.Mock).mockImplementation(async (inputUrl: string) => {
        const url = new URL(inputUrl);
        const endpoint = url.pathname + (url.searchParams.has('graphVersions')
          ? `?${url.searchParams.get('graphVersions')}` : '');
        if (endpoint === failedEndpoint) { return { ok: false }; }
        return response(url.pathname === '/samples' ? { sampleQueries: [sample] } : tree);
      });
      const result = await store.dispatch(applyCustomSamples(input) as any);
      expect(result.type).toBe(applyCustomSamples.rejected.type);
      expect(store.getState().devxApi.custom).toBe(false);
      expect(store.getState().devxApi.error).toMatch(/could not be loaded/i);
      expect(store.getState().samples.queries).toEqual(previousSamples);
    });

  it('resets immediately and reloads defaults without changing the Graph request', async () => {
    const store = createStore();
    await store.dispatch(applyCustomSamples(input) as any);
    (global.fetch as jest.Mock).mockClear();
    store.dispatch(resetCustomSamples() as any);
    expect(store.getState().devxApi.custom).toBe(false);
    await waitFor(() => expect(store.getState().samples.pending).toBe(false));
    expect(store.getState().sampleQuery).toEqual(query);
    (global.fetch as jest.Mock).mock.calls.forEach(([url]) => {
      expect(String(url).startsWith(defaultDevxConfiguration().baseUrl)).toBe(true);
      expect(new URL(url).searchParams.has('org')).toBe(false);
    });
  });

  it.each(['sign-out', 'Microsoft account switch', 'external account switch'])(
    'restores defaults on %s', async event => {
      const store = createStore();
      await store.dispatch(applyCustomSamples(input) as any);
      if (event === 'sign-out') {
        store.dispatch(signOutSuccess());
      } else {
        getAccount.mockReturnValue({
          ...account, homeAccountId: 'other',
          username: event.startsWith('external') ? 'alias@example.com' : account.username
        });
        store.dispatch(getAuthTokenSuccess());
      }
      expect(store.getState().devxApi.custom).toBe(false);
      await waitFor(() => expect(store.getState().resources.pending).toBe(false));
    });

  it('preserves customization on same-account token refresh', async () => {
    const store = createStore();
    await store.dispatch(applyCustomSamples(input) as any);
    store.dispatch(getAuthTokenSuccess());
    expect(store.getState().devxApi.custom).toBe(true);
  });

  it('cannot apply for an external account or persist settings into a new store', async () => {
    getAccount.mockReturnValue({ ...account, username: 'alias@example.com' });
    const store = createStore();
    const result = await store.dispatch(applyCustomSamples(input) as any);
    expect(result.type).toBe(applyCustomSamples.rejected.type);
    expect(global.fetch).not.toHaveBeenCalled();
    getAccount.mockReturnValue(account);
    await store.dispatch(applyCustomSamples(input) as any);
    expect(createStore().getState().devxApi.custom).toBe(false);
  });

  it('ignores late old sample results and writes their original cache namespace', async () => {
    const store = createStore();
    const old = deferred<any>();
    (global.fetch as jest.Mock).mockImplementationOnce(() => old.promise);
    const oldRequest = store.dispatch(fetchSamples() as any);
    await store.dispatch(applyCustomSamples(input) as any);
    old.resolve(response({ sampleQueries: [{ ...sample, humanName: 'Old default' }] }));
    await oldRequest;
    expect(store.getState().samples.queries).toEqual([sample]);
    expect(samplesCache.saveSamples).toHaveBeenLastCalledWith(
      [expect.objectContaining({ humanName: 'Old default' })],
      expect.objectContaining({ baseUrl: defaultDevxConfiguration().baseUrl, custom: false })
    );
  });

  it.each(['resources', 'full permissions', 'query permissions', 'snippets', 'autocomplete'])(
    'ignores late old %s results after customization', async consumer => {
      const store = createStore();
      const old = deferred<any>();
      (global.fetch as jest.Mock).mockImplementationOnce(() => old.promise);
      const oldRequest = consumer === 'resources' ? store.dispatch(fetchResources() as any)
        : consumer === 'full permissions' ? store.dispatch(fetchScopes('full') as any)
          : consumer === 'query permissions' ? store.dispatch(fetchScopes('query') as any)
            : consumer === 'snippets' ? store.dispatch(getSnippet('python') as any)
              : store.dispatch(fetchAutoCompleteOptions({
                url: 'users', version: 'v1.0', context: 'parameters'
              }) as any);
      await waitFor(() => expect(global.fetch).toHaveBeenCalled());
      await store.dispatch(applyCustomSamples(input) as any);
      const before = store.getState();
      old.resolve(response(consumer === 'resources' ? { ...tree, segment: 'old' } : [{ value: 'Old.Read' }]));
      await oldRequest;
      const after = store.getState();
      expect(after.resources.data).toEqual(before.resources.data);
      expect(after.scopes.data).toEqual(before.scopes.data);
      expect(after.snippets.data).toEqual(before.snippets.data);
      expect(after.autoComplete.data).toEqual(before.autoComplete.data);
    }
  );

  it.each(['reset', 'sign-out', 'cancel'])('cannot activate a late candidate after %s', async event => {
    const store = createStore();
    const candidate = deferred<any>();
    (global.fetch as jest.Mock).mockImplementationOnce(() => candidate.promise);
    const request = store.dispatch(applyCustomSamples(input) as any);
    if (event === 'reset') { store.dispatch(resetCustomSamples() as any); }
    if (event === 'sign-out') { store.dispatch(signOutSuccess()); }
    if (event === 'cancel') { request.abort(); }
    candidate.resolve(response({ sampleQueries: [sample] }));
    await request;
    await waitFor(() => expect(samplesCache.saveSamples).toHaveBeenCalledWith(
      [sample], expect.objectContaining({ custom: true })
    ));
    expect(store.getState().devxApi.custom).toBe(false);
  });

  it('accepts an empty custom sample set without fallback or automatic selection', async () => {
    const store = createStore();
    (global.fetch as jest.Mock).mockImplementation(async (url: string) =>
      response(url.endsWith('/samples') || new URL(url).pathname === '/samples' ? { sampleQueries: [] } : tree));
    await store.dispatch(applyCustomSamples(input) as any);
    expect(store.getState().samples.queries).toEqual([]);
    expect(store.getState().samples.loaded).toBe(true);
    expect(store.getState().samples.hasAutoSelectedDefault).toBe(true);
    expect(store.getState().sampleQuery).toEqual(query);
  });
});
