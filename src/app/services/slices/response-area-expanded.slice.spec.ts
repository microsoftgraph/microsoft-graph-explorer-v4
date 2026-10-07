import responseAreaExpandedReducer, { expandResponseArea } from './response-area-expanded.slice';

describe('response-area-expanded slice', () => {
  it('should return initial state as false', () => {
    const state = responseAreaExpandedReducer(undefined, { type: 'unknown' });
    expect(state).toBe(false);
  });

  it('should expand response area', () => {
    const state = responseAreaExpandedReducer(false, expandResponseArea(true));
    expect(state).toBe(true);
  });

  it('should collapse response area', () => {
    const state = responseAreaExpandedReducer(true, expandResponseArea(false));
    expect(state).toBe(false);
  });
});
