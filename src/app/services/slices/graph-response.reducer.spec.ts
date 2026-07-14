import reducer, { setQueryResponse, runQuery } from './graph-response.slice';
import { LOGOUT_SUCCESS } from '../redux-constants';

// Mock dependencies to prevent circular imports
jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: {
    getAccount: jest.fn(),
    logIn: jest.fn()
  }
}));
jest.mock('../../../modules/authentication/ClaimsChallenge', () => ({
  ClaimsChallenge: jest.fn().mockImplementation(() => ({ handle: jest.fn() }))
}));
jest.mock('../../../modules/cache/history-utils', () => ({
  historyCache: { writeHistoryData: jest.fn() }
}));

describe('graph-response.slice reducer', () => {
  const initialState = {
    isLoadingData: false,
    response: {
      body: undefined,
      headers: {}
    }
  };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setQueryResponse', () => {
    const payload = { body: { data: 'test' }, headers: { 'Content-Type': 'application/json' } };
    const state = reducer(initialState, setQueryResponse(payload as any));
    expect(state.isLoadingData).toBe(false);
    expect(state.response.body).toEqual({ data: 'test' });
    expect(state.response.headers).toEqual({ 'Content-Type': 'application/json' });
  });

  it('should set loading on runQuery.pending', () => {
    const action = { type: runQuery.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoadingData).toBe(true);
    expect(state.response.body).toBeUndefined();
  });

  it('should handle runQuery.fulfilled', () => {
    const loadingState = { ...initialState, isLoadingData: true };
    const action = {
      type: runQuery.fulfilled.type,
      payload: { body: { name: 'test' }, headers: { 'content-type': 'application/json' } }
    };
    const state = reducer(loadingState, action);
    expect(state.isLoadingData).toBe(false);
    expect(state.response.body).toEqual({ name: 'test' });
  });

  it('should handle runQuery.fulfilled with undefined payload', () => {
    const loadingState = { ...initialState, isLoadingData: true };
    const action = { type: runQuery.fulfilled.type, payload: undefined };
    const state = reducer(loadingState, action);
    expect(state.isLoadingData).toBe(false);
  });

  it('should handle runQuery.rejected', () => {
    const loadingState = { ...initialState, isLoadingData: true };
    const action = {
      type: runQuery.rejected.type,
      payload: { body: { error: 'bad request' }, headers: {} }
    };
    const state = reducer(loadingState, action);
    expect(state.isLoadingData).toBe(false);
    expect(state.response.body).toEqual({ error: 'bad request' });
  });

  it('should handle LOGOUT_SUCCESS', () => {
    const stateWithData = {
      isLoadingData: true,
      response: { body: { data: 'test' }, headers: { 'x-header': 'value' } }
    };
    const state = reducer(stateWithData as any, { type: LOGOUT_SUCCESS });
    expect(state.isLoadingData).toBe(false);
    expect(state.response.body).toBeUndefined();
  });
});
