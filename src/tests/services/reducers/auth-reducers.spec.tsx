import { authToken } from '../../../app/services/reducers/auth-reducers';
import { GET_AUTH_TOKEN_SUCCESS } from '../../../app/services/redux-constants';

describe('Auth Reducer', () => {
  it('should return initial state', () => {
    const initialState = { token: false, pending: false };
    const dummyAction = { type: 'Dummy', response: { displayName: 'Megan Bowen' } };
    const newState = authToken(initialState, dummyAction);

    expect(newState).toEqual(initialState);
  });

  it('should handle GET_AUTH_TOKEN_SUCCESS', () => {
    const initialState = { token: false, pending: false };

    const queryAction = { type: GET_AUTH_TOKEN_SUCCESS, response: true };
    const newState = authToken(initialState, queryAction);

    expect(newState).toEqual({ token: true, pending: false });
  });
});
