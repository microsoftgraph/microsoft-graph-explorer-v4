import reducer, { fetchAutoCompleteOptions } from './autocomplete.slice';

jest.mock('../../../modules/suggestions', () => ({
  suggestions: { getSuggestions: jest.fn() }
}));

describe('autocomplete.slice reducer', () => {
  const initialState = {
    pending: false,
    data: null,
    error: null
  };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set pending on fetchAutoCompleteOptions.pending', () => {
    const state = reducer(initialState, { type: fetchAutoCompleteOptions.pending.type });
    expect(state.pending).toBe(true);
    expect(state.data).toBeNull();
    expect(state.error).toBeNull();
  });

  it('should set data on fetchAutoCompleteOptions.fulfilled', () => {
    const data = { url: '/me', parameters: [], createdAt: '' };
    const state = reducer(initialState, {
      type: fetchAutoCompleteOptions.fulfilled.type,
      payload: data
    });
    expect(state.pending).toBe(false);
    expect(state.data).toEqual(data);
    expect(state.error).toBeNull();
  });

  it('should handle fetchAutoCompleteOptions.rejected with payload', () => {
    const error = new Error('Failed');
    const state = reducer(initialState, {
      type: fetchAutoCompleteOptions.rejected.type,
      payload: error
    });
    expect(state.pending).toBe(false);
    expect(state.data).toBeNull();
    expect(state.error).toEqual(error);
  });

  it('should handle fetchAutoCompleteOptions.rejected without payload', () => {
    const state = reducer(initialState, {
      type: fetchAutoCompleteOptions.rejected.type,
      payload: undefined
    });
    expect(state.pending).toBe(false);
    expect(state.data).toBeNull();
  });
});
