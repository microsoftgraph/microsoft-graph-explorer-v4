import reducer, { fetchResources } from './resources.slice';

jest.mock('../../../modules/cache/resources.cache', () => ({
  resourcesCache: {
    readResources: jest.fn(),
    saveResources: jest.fn()
  }
}));

describe('resources.slice reducer', () => {
  const initialState = {
    pending: false,
    data: {},
    error: null
  };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set pending on fetchResources.pending', () => {
    const state = reducer(initialState, { type: fetchResources.pending.type });
    expect(state.pending).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should set data on fetchResources.fulfilled', () => {
    const resourceData = {
      'v1.0': { segment: '/', children: [], labels: [] },
      beta: { segment: '/', children: [], labels: [] }
    };
    const state = reducer(initialState, {
      type: fetchResources.fulfilled.type,
      payload: resourceData
    });
    expect(state.pending).toBe(false);
    expect(state.data).toEqual(resourceData);
    expect(state.error).toBeNull();
  });

  it('should handle fetchResources.rejected', () => {
    const error = new Error('Failed to fetch');
    const state = reducer(initialState, {
      type: fetchResources.rejected.type,
      payload: error
    });
    expect(state.pending).toBe(false);
    expect(state.error).toEqual(error);
  });

  describe('fetchResources thunk dispatched', () => {
    const { resourcesCache } = require('../../../modules/cache/resources.cache');
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
      jest.clearAllMocks();
    });

    function createStore() {
      return (require('@reduxjs/toolkit') as any).configureStore({
        reducer: {
          resources: reducer,
          devxApi: () => ({ baseUrl: 'https://graphexplorerapi.azurewebsites.net' })
        }
      });
    }

    it('returns cached resources when available', async () => {
      const v1Data = { segment: '/', children: [], labels: [] };
      const betaData = { segment: '/', children: [], labels: [] };
      resourcesCache.readResources
        .mockResolvedValueOnce(v1Data)
        .mockResolvedValueOnce(betaData);

      const store = createStore();
      const result = await store.dispatch(fetchResources());
      expect(result.type).toBe('resources/fetchResources/fulfilled');
      expect(result.payload).toEqual({ 'v1.0': v1Data, beta: betaData });
    });

    it('fetches from API when cache is empty', async () => {
      resourcesCache.readResources.mockResolvedValue(null);
      const v1Data = { segment: '/', children: [{ name: 'users' }], labels: [] };
      const betaData = { segment: '/', children: [{ name: 'groups' }], labels: [] };
      global.fetch = jest.fn()
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(v1Data) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(betaData) });

      const store = createStore();
      const result = await store.dispatch(fetchResources());
      expect(result.type).toBe('resources/fetchResources/fulfilled');
      expect(result.payload).toEqual({ 'v1.0': v1Data, beta: betaData });
      expect(resourcesCache.saveResources).toHaveBeenCalledTimes(2);
    });

    it('rejects when API fetch fails', async () => {
      resourcesCache.readResources.mockResolvedValue(null);
      global.fetch = jest.fn()
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({ ok: false });

      const store = createStore();
      const result = await store.dispatch(fetchResources());
      expect(result.type).toBe('resources/fetchResources/rejected');
    });

    it('rejects when cache throws', async () => {
      resourcesCache.readResources.mockRejectedValue(new Error('cache error'));

      const store = createStore();
      const result = await store.dispatch(fetchResources());
      expect(result.type).toBe('resources/fetchResources/rejected');
    });
  });
});
