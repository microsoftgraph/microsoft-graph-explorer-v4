import { configureStore } from '@reduxjs/toolkit';
import { setSnippetTabSuccess, getSnippet } from './snippet.slice';
import snippetReducer from './snippet.slice';

describe('snippet slice', () => {
  it('should return initial state', () => {
    const state = snippetReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      pending: false,
      data: {},
      error: {},
      snippetTab: 'csharp'
    });
  });

  it('should set snippet tab', () => {
    const state = snippetReducer(undefined, setSnippetTabSuccess('javascript'));
    expect(state.snippetTab).toBe('javascript');
  });

  it('should change snippet tab from one language to another', () => {
    let state = snippetReducer(undefined, setSnippetTabSuccess('python'));
    expect(state.snippetTab).toBe('python');
    state = snippetReducer(state, setSnippetTabSuccess('go'));
    expect(state.snippetTab).toBe('go');
  });

  describe('getSnippet async thunk extra reducers', () => {
    it('should set pending true and clear data/error on pending', () => {
      const prevState = {
        pending: false,
        data: { csharp: 'old snippet' },
        error: { error: 'old error', language: 'csharp' } as any,
        snippetTab: 'csharp'
      };
      const state = snippetReducer(prevState, { type: getSnippet.pending.type });
      expect(state.pending).toBe(true);
      expect(state.data).toEqual({});
      expect(state.error).toEqual({});
    });

    it('should set snippet data on fulfilled', () => {
      const prevState = { pending: true, data: {}, error: {} as any, snippetTab: 'csharp' };
      const payload = { csharp: 'var client = new GraphClient();' };
      const state = snippetReducer(prevState, { type: getSnippet.fulfilled.type, payload });
      expect(state.pending).toBe(false);
      expect(state.data).toEqual({ csharp: 'var client = new GraphClient();' });
      expect(state.error).toEqual({});
    });

    it('should lowercase the language key on fulfilled', () => {
      const prevState = { pending: true, data: {}, error: {} as any, snippetTab: 'csharp' };
      const payload = { CSharp: 'var client = new GraphClient();' };
      const state = snippetReducer(prevState, { type: getSnippet.fulfilled.type, payload });
      expect(state.data).toEqual({ csharp: 'var client = new GraphClient();' });
    });

    it('should set error on rejected', () => {
      const prevState = { pending: true, data: { csharp: 'old' }, error: {} as any, snippetTab: 'csharp' };
      const errorPayload = { error: 'Not Found', language: 'python' };
      const state = snippetReducer(prevState, { type: getSnippet.rejected.type, payload: errorPayload });
      expect(state.pending).toBe(false);
      expect(state.error).toEqual(errorPayload);
      expect(state.data).toEqual({});
    });

    it('should preserve snippetTab across all thunk states', () => {
      let state = snippetReducer(undefined, setSnippetTabSuccess('python'));
      expect(state.snippetTab).toBe('python');

      state = snippetReducer(state, { type: getSnippet.pending.type });
      expect(state.snippetTab).toBe('python');

      state = snippetReducer(state, { type: getSnippet.fulfilled.type, payload: { python: 'import requests' } });
      expect(state.snippetTab).toBe('python');
    });
  });

  describe('getSnippet async thunk dispatched', () => {
    const makeStore = (sampleUrl = 'https://graph.microsoft.com/v1.0/me') =>
      configureStore({
        reducer: {
          snippet: snippetReducer,
          devxApi: () => ({ baseUrl: 'https://graphexplorerapi.azurewebsites.net' }),
          sampleQuery: () => ({
            sampleUrl,
            selectedVerb: 'GET',
            sampleHeaders: [],
            sampleBody: null
          })
        }
      });

    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
      jest.restoreAllMocks();
    });

    it('should reject when sampleUrl is invalid', async () => {
      const store = makeStore('not-a-valid-url');
      await store.dispatch(getSnippet('csharp'));
      const state = store.getState().snippet;
      expect(state.pending).toBe(false);
      expect(state.error).toBeDefined();
      expect(state.error.error).toContain('url is invalid');
    });

    it('should append lang param for non-csharp languages', async () => {
      const store = makeStore();
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('snippet code')
      });
      await store.dispatch(getSnippet('javascript'));
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('?lang=javascript'),
        expect.anything()
      );
    });

    it('should append openapi generation for go language', async () => {
      const store = makeStore();
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('snippet code')
      });
      await store.dispatch(getSnippet('go'));
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('generation=openapi'),
        expect.anything()
      );
    });

    it('should set data on successful fetch', async () => {
      const store = makeStore();
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('var client = new Client()')
      });
      await store.dispatch(getSnippet('csharp'));
      const state = store.getState().snippet;
      expect(state.pending).toBe(false);
      expect(state.data).toEqual({ csharp: 'var client = new Client()' });
    });

    it('should reject when fetch response is not ok', async () => {
      const store = makeStore();
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found'
      });
      await store.dispatch(getSnippet('csharp'));
      const state = store.getState().snippet;
      expect(state.error.error).toContain('Not Found');
    });

    it('should reject when fetch throws', async () => {
      const store = makeStore();
      global.fetch = jest.fn().mockRejectedValue(new Error('Network failure'));
      await store.dispatch(getSnippet('csharp'));
      const state = store.getState().snippet;
      expect(state.error.error).toContain('Network failure');
    });
  });
});
