import reducer, { fetchSamples, setHasAutoSelectedDefault } from './samples.slice';

jest.mock('../../../modules/cache/samples.cache', () => ({
  samplesCache: { readSamples: jest.fn().mockResolvedValue([]), saveSamples: jest.fn() }
}));

jest.mock('../../views/sidebar/sample-queries/queries', () => ({
  queries: [{ id: 'default', humanName: 'Default Query' }]
}));

describe('samples.slice reducer', () => {
  const initialState = {
    queries: [],
    pending: false,
    error: null,
    hasAutoSelectedDefault: false
  };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setHasAutoSelectedDefault', () => {
    const state = reducer(initialState, setHasAutoSelectedDefault(true));
    expect(state.hasAutoSelectedDefault).toBe(true);
  });

  it('should set pending on fetchSamples.pending', () => {
    const state = reducer(initialState, { type: fetchSamples.pending.type });
    expect(state.pending).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should set queries on fetchSamples.fulfilled', () => {
    const queries = [{ id: '1', humanName: 'Test' }];
    const state = reducer(initialState, { type: fetchSamples.fulfilled.type, payload: queries });
    expect(state.queries).toEqual(queries);
    expect(state.pending).toBe(false);
  });

  it('should handle fetchSamples.rejected with payload', () => {
    const cachedQueries = [{ id: 'cached', humanName: 'Cached' }];
    const state = reducer(initialState, { type: fetchSamples.rejected.type, payload: cachedQueries });
    expect(state.queries).toEqual(cachedQueries);
    expect(state.pending).toBe(false);
    expect(state.error).toBe('failed');
  });
});
