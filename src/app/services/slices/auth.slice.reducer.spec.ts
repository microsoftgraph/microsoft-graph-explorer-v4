jest.mock('../actions/revoke-scopes.action', () => {
  const mockFn: any = jest.fn(() => ({ type: 'revoke/mock' }));
  mockFn.pending = { type: 'revokeScopes/pending' };
  mockFn.fulfilled = { type: 'revokeScopes/fulfilled' };
  mockFn.rejected = { type: 'revokeScopes/rejected' };
  return { revokeScopes: mockFn };
});
jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: {
    logOut: jest.fn(),
    logOutPopUp: jest.fn(),
    consentToScopes: jest.fn()
  }
}));
jest.mock('../../../modules/authentication/authentication-error-hints', () => ({
  getConsentAuthErrorHint: jest.fn().mockReturnValue('')
}));
jest.mock('./permission-grants.slice', () => ({
  fetchAllPrincipalGrants: jest.fn(() => ({ type: 'permGrants/fetch' }))
}));
jest.mock('./profile.slice', () => ({
  getProfileInfo: jest.fn(() => ({ type: 'profile/get' }))
}));
jest.mock('./query-status.slice', () => ({
  setQueryResponseStatus: jest.fn((s: any) => ({ type: 'queryStatus/set', payload: s }))
}));
jest.mock('../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import authReducer, {
  getAuthTokenSuccess,
  signOutSuccess,
  setAuthenticationPending,
  getConsentedScopesSuccess,
  consentToScopes,
  signOut,
  signIn,
  storeScopes
} from './auth.slice';

describe('auth slice reducer', () => {
  const initialState = {
    authToken: { pending: false, token: false },
    consentedScopes: []
  };

  it('should return initial state', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle getAuthTokenSuccess', () => {
    const state = authReducer(initialState, getAuthTokenSuccess());
    expect(state.authToken.token).toBe(true);
    expect(state.authToken.pending).toBe(false);
  });

  it('should handle signOutSuccess', () => {
    const loggedInState = {
      authToken: { token: true, pending: false },
      consentedScopes: ['User.Read']
    };
    const state = authReducer(loggedInState, signOutSuccess());
    expect(state.authToken.token).toBe(false);
    expect(state.authToken.pending).toBe(false);
    expect(state.consentedScopes).toEqual([]);
  });

  it('should handle setAuthenticationPending', () => {
    const state = authReducer(initialState, setAuthenticationPending());
    expect(state.authToken.token).toBe(true);
    expect(state.authToken.pending).toBe(true);
  });

  it('should handle getConsentedScopesSuccess', () => {
    const scopes = ['User.Read', 'Mail.Read'];
    const state = authReducer(initialState, getConsentedScopesSuccess(scopes));
    expect(state.consentedScopes).toEqual(scopes);
  });

  it('should replace consented scopes on subsequent calls', () => {
    let state = authReducer(initialState, getConsentedScopesSuccess(['User.Read']));
    state = authReducer(state, getConsentedScopesSuccess(['Mail.Read', 'Files.Read']));
    expect(state.consentedScopes).toEqual(['Mail.Read', 'Files.Read']);
  });

  describe('consentToScopes extra reducers', () => {
    it('should set pending true on consentToScopes.pending', () => {
      const state = authReducer(initialState, { type: consentToScopes.pending.type });
      expect(state.authToken.pending).toBe(true);
    });

    it('should set pending false and update scopes on consentToScopes.fulfilled', () => {
      const pendingState = { authToken: { token: true, pending: true }, consentedScopes: [] };
      const state = authReducer(pendingState, {
        type: consentToScopes.fulfilled.type,
        payload: ['User.Read', 'Mail.Send']
      });
      expect(state.authToken.pending).toBe(false);
      expect(state.consentedScopes).toEqual(['User.Read', 'Mail.Send']);
    });

    it('should set pending false on consentToScopes.rejected', () => {
      const pendingState = { authToken: { token: true, pending: true }, consentedScopes: ['User.Read'] };
      const state = authReducer(pendingState, { type: consentToScopes.rejected.type });
      expect(state.authToken.pending).toBe(false);
      expect(state.consentedScopes).toEqual(['User.Read']);
    });

    it('should preserve existing scopes on consentToScopes.rejected', () => {
      const pendingState = {
        authToken: { token: true, pending: true },
        consentedScopes: ['User.Read', 'Mail.Read']
      };
      const state = authReducer(pendingState, { type: consentToScopes.rejected.type });
      expect(state.consentedScopes).toEqual(['User.Read', 'Mail.Read']);
    });

    it('should transition from initial through pending to fulfilled', () => {
      let state = authReducer(initialState, { type: consentToScopes.pending.type });
      expect(state.authToken.pending).toBe(true);
      state = authReducer(state, {
        type: consentToScopes.fulfilled.type,
        payload: ['Directory.Read.All']
      });
      expect(state.authToken.pending).toBe(false);
      expect(state.consentedScopes).toEqual(['Directory.Read.All']);
    });
  });

  describe('revokeScopes extra reducers', () => {
    it('should set pending true on revokeScopes.pending', () => {
      const state = authReducer(initialState, { type: 'revokeScopes/pending' });
      expect(state.authToken.pending).toBe(true);
    });

    it('should set pending false and update scopes on revokeScopes.fulfilled', () => {
      const pendingState = { authToken: { token: true, pending: true }, consentedScopes: ['User.Read', 'Mail.Send'] };
      const state = authReducer(pendingState, {
        type: 'revokeScopes/fulfilled',
        payload: ['User.Read']
      });
      expect(state.authToken.pending).toBe(false);
      expect(state.consentedScopes).toEqual(['User.Read']);
    });

    it('should set pending false on revokeScopes.rejected', () => {
      const pendingState = { authToken: { token: true, pending: true }, consentedScopes: ['User.Read'] };
      const state = authReducer(pendingState, { type: 'revokeScopes/rejected' });
      expect(state.authToken.pending).toBe(false);
    });
  });

  describe('signOut thunk', () => {
    it('calls logOut in Complete mode', () => {
      const { authenticationWrapper } = require('../../../modules/authentication');
      authenticationWrapper.logOut.mockClear();
      const dispatch = jest.fn();
      const getState = () => ({ graphExplorerMode: 'COMPLETE' });
      signOut()(dispatch, getState);
      expect(authenticationWrapper.logOut).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(2);
    });

    it('calls logOutPopUp in non-Complete mode', () => {
      const { authenticationWrapper } = require('../../../modules/authentication');
      authenticationWrapper.logOutPopUp.mockClear();
      const dispatch = jest.fn();
      const getState = () => ({ graphExplorerMode: 'TryIt' });
      signOut()(dispatch, getState);
      expect(authenticationWrapper.logOutPopUp).toHaveBeenCalled();
    });
  });

  describe('signIn and storeScopes', () => {
    it('signIn dispatches getAuthTokenSuccess', () => {
      const dispatch = jest.fn();
      signIn()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('getAuthTokenSuccess')
      }));
    });

    it('storeScopes dispatches getConsentedScopesSuccess', () => {
      const dispatch = jest.fn();
      storeScopes(['User.Read'])(dispatch);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('getConsentedScopesSuccess'),
        payload: ['User.Read']
      }));
    });
  });

  describe('consentToScopes thunk', () => {
    it('dispatches success when consent succeeds', async () => {
      const { configureStore } = require('@reduxjs/toolkit');
      const { authenticationWrapper } = require('../../../modules/authentication');
      authenticationWrapper.consentToScopes.mockResolvedValue({
        accessToken: 'token',
        scopes: ['User.Read', 'Mail.Read'],
        account: { localAccountId: 'user-1' }
      });
      const store = configureStore({
        reducer: {
          auth: authReducer,
          profile: () => ({ user: { id: 'user-1' } })
        },
        preloadedState: {
          auth: { authToken: { token: true, pending: false }, consentedScopes: ['User.Read'] }
        }
      });
      const result = await store.dispatch(consentToScopes(['Mail.Read']));
      expect(result.type).toBe('auth/consentToScopes/fulfilled');
    });

    it('dispatches error status on consent error', async () => {
      const { configureStore } = require('@reduxjs/toolkit');
      const { authenticationWrapper } = require('../../../modules/authentication');
      const { setQueryResponseStatus } = require('./query-status.slice');
      setQueryResponseStatus.mockClear();
      authenticationWrapper.consentToScopes.mockRejectedValue({ errorCode: 'user_cancelled' });
      const store = configureStore({
        reducer: {
          auth: authReducer,
          profile: () => ({ user: { id: 'user-1' } })
        }
      });
      const result = await store.dispatch(consentToScopes(['Mail.Read']));
      // The thunk catches the error and dispatches setQueryResponseStatus
      // It doesn't rejectWithValue, so it returns fulfilled with undefined
      expect(setQueryResponseStatus).toHaveBeenCalledWith(expect.objectContaining({
        ok: false,
        messageBarType: 'error'
      }));
    });
  });
});
