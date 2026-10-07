import termsOfUseReducer, { clearTermsOfUse } from './terms-of-use.slice';

describe('terms-of-use slice', () => {
  it('should return initial state as true', () => {
    const state = termsOfUseReducer(undefined, { type: 'unknown' });
    expect(state).toBe(true);
  });

  it('should clear terms of use (set to false)', () => {
    const state = termsOfUseReducer(true, clearTermsOfUse());
    expect(state).toBe(false);
  });
});
