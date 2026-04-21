import reducer, { getProfileInfo } from './profile.slice';

jest.mock('../actions/profile-actions', () => ({
  getProfileInformation: jest.fn(),
  getBetaProfile: jest.fn(),
  getProfileImage: jest.fn(),
  getTenantInfo: jest.fn()
}));

describe('profile.slice reducer', () => {
  const initialState = {
    status: 'unset',
    user: undefined,
    error: undefined
  };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set pending state on getProfileInfo.pending', () => {
    const state = reducer(initialState, { type: getProfileInfo.pending.type });
    expect(state.status).toBe('unset');
    expect(state.user).toBeUndefined();
    expect(state.error).toBeUndefined();
  });

  it('should set user on getProfileInfo.fulfilled', () => {
    const user = { id: '123', displayName: 'Test User', emailAddress: 'test@test.com' };
    const state = reducer(initialState, { type: getProfileInfo.fulfilled.type, payload: user });
    expect(state.status).toBe('success');
    expect(state.user).toEqual(user);
  });

  it('should handle getProfileInfo.rejected', () => {
    const error = { message: 'Failed' };
    const state = reducer(initialState, { type: getProfileInfo.rejected.type, error });
    expect(state.status).toBe('error');
    expect(state.user).toBeUndefined();
  });
});
