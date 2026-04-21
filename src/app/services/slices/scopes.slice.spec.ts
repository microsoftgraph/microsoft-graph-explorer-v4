import reducer from './scopes.slice';
import { fetchScopes } from './scopes.slice';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('../../utils/getPermissionsScopeType', () => ({
  getPermissionsScopeType: jest.fn().mockReturnValue('DelegatedWork')
}));
jest.mock('../../utils/query-url-sanitization', () => ({
  sanitizeQueryUrl: jest.fn((url: string) => url)
}));
jest.mock('../../utils/sample-url-generation', () => ({
  parseSampleUrl: jest.fn((url: string) => ({ requestUrl: 'me', sampleUrl: url }))
}));

describe('scopes.slice reducer', () => {
  const initialState = {
    pending: {
      isSpecificPermissions: false,
      isFullPermissions: false
    },
    data: {
      specificPermissions: [],
      fullPermissions: []
    },
    error: null
  };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set full permissions pending on fetchScopes.pending with full arg', () => {
    const action = { type: fetchScopes.pending.type, meta: { arg: 'full' } };
    const state = reducer(initialState, action);
    expect(state.pending.isFullPermissions).toBe(true);
    expect(state.pending.isSpecificPermissions).toBe(false);
  });

  it('should set specific permissions pending on fetchScopes.pending with query arg', () => {
    const action = { type: fetchScopes.pending.type, meta: { arg: 'query' } };
    const state = reducer(initialState, action);
    expect(state.pending.isSpecificPermissions).toBe(true);
    expect(state.pending.isFullPermissions).toBe(false);
  });

  it('should set full permissions on fetchScopes.fulfilled with full arg', () => {
    const permissions = [{ value: 'User.Read', consentDisplayName: 'Read user', consentDescription: '', isAdmin: false }];
    const action = {
      type: fetchScopes.fulfilled.type,
      meta: { arg: 'full' },
      payload: { scopes: { fullPermissions: permissions } }
    };
    const state = reducer(initialState, action);
    expect(state.data.fullPermissions).toEqual(permissions);
    expect(state.pending.isFullPermissions).toBe(false);
  });

  it('should set specific permissions on fetchScopes.fulfilled with query arg', () => {
    const permissions = [{ value: 'Mail.Read', consentDisplayName: 'Read mail', consentDescription: '', isAdmin: false }];
    const action = {
      type: fetchScopes.fulfilled.type,
      meta: { arg: 'query' },
      payload: { scopes: { specificPermissions: permissions } }
    };
    const state = reducer(initialState, action);
    expect(state.data.specificPermissions).toEqual(permissions);
    expect(state.pending.isSpecificPermissions).toBe(false);
  });

  it('should handle fetchScopes.rejected', () => {
    const error = { message: 'Failed' };
    const action = { type: fetchScopes.rejected.type, payload: error };
    const state = reducer(initialState, action);
    expect(state.pending.isFullPermissions).toBe(false);
    expect(state.pending.isSpecificPermissions).toBe(false);
    expect(state.error).toEqual(error);
  });

  it('should clear error on pending', () => {
    const stateWithError = { ...initialState, error: { message: 'old error' } as any };
    const action = { type: fetchScopes.pending.type, meta: { arg: 'full' } };
    const state = reducer(stateWithError, action);
    expect(state.error).toBeNull();
  });

  it('should reset data on rejected', () => {
    const stateWithData = {
      ...initialState,
      data: {
        specificPermissions: [{ value: 'User.Read' }] as any[],
        fullPermissions: [{ value: 'Mail.Read' }] as any[]
      }
    };
    const action = { type: fetchScopes.rejected.type, payload: { message: 'Error' } };
    const state = reducer(stateWithData, action);
    expect(state.data.specificPermissions).toEqual([]);
    expect(state.data.fullPermissions).toEqual([]);
  });

  it('should reset pending on fulfilled', () => {
    const pendingState = {
      ...initialState,
      pending: { isSpecificPermissions: true, isFullPermissions: true }
    };
    const action = {
      type: fetchScopes.fulfilled.type,
      meta: { arg: 'full' },
      payload: { scopes: { fullPermissions: [] } }
    };
    const state = reducer(pendingState, action);
    expect(state.pending.isFullPermissions).toBe(false);
    expect(state.pending.isSpecificPermissions).toBe(false);
  });

  it('should handle fulfilled with undefined fullPermissions', () => {
    const action = {
      type: fetchScopes.fulfilled.type,
      meta: { arg: 'full' },
      payload: { scopes: { fullPermissions: undefined } }
    };
    const state = reducer(initialState, action);
    expect(state.data.fullPermissions).toEqual([]);
  });

  it('should handle fulfilled with undefined specificPermissions', () => {
    const action = {
      type: fetchScopes.fulfilled.type,
      meta: { arg: 'query' },
      payload: { scopes: { specificPermissions: undefined } }
    };
    const state = reducer(initialState, action);
    expect(state.data.specificPermissions).toEqual([]);
  });

  describe('fetchScopes thunk - dispatched', () => {
    function createStore() {
      return configureStore({
        reducer: {
          scopes: reducer,
          devxApi: () => ({ baseUrl: 'https://graphexplorerapi.azurewebsites.net', parameters: 'openapi-operationids=Users.Get' }),
          profile: () => ({ user: { id: 'user-1' } }),
          sampleQuery: () => ({ sampleUrl: 'https://graph.microsoft.com/v1.0/me', selectedVerb: 'GET' })
        }
      });
    }

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('dispatches fulfilled for full scopes fetch on 200', async () => {
      const permissions = [{ value: 'User.Read', consentDisplayName: 'Read', consentDescription: '', isAdmin: false }];
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(permissions)
      });

      const store = createStore();
      const result = await store.dispatch(fetchScopes('full'));
      expect(result.type).toBe('scopes/fetchScopes/fulfilled');
      expect(result.payload).toEqual({ scopes: { fullPermissions: permissions } });
    });

    it('dispatches fulfilled for query scopes fetch on 200', async () => {
      const permissions = [{ value: 'Mail.Read', consentDisplayName: 'Read mail', consentDescription: '', isAdmin: false }];
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(permissions)
      });

      const store = createStore();
      const result = await store.dispatch(fetchScopes('query'));
      expect(result.type).toBe('scopes/fetchScopes/fulfilled');
      expect(result.payload).toEqual({ scopes: { specificPermissions: permissions } });
    });

    it('dispatches rejected when response is not ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 403
      });

      const store = createStore();
      const result = await store.dispatch(fetchScopes('full'));
      expect(result.type).toBe('scopes/fetchScopes/rejected');
    });

    it('dispatches rejected when fetch throws', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const store = createStore();
      const result = await store.dispatch(fetchScopes('full'));
      expect(result.type).toBe('scopes/fetchScopes/rejected');
    });

    it('includes devxApi parameters in the request URL', async () => {
      const permissions = [{ value: 'User.Read' }];
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(permissions)
      });

      const store = createStore();
      await store.dispatch(fetchScopes('full'));
      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain('openapi-operationids=Users.Get');
    });
  });
});
