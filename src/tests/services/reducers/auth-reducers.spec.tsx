import { authToken } from '../../../app/services/reducers/auth-reducers';
import { GET_AUTH_TOKEN_SUCCESS } from '../../../app/services/redux-constants';

describe('Auth Reducer', () => {
  it('should return initial state', () => {
    const initialState = {};
    const dummyAction = { type: 'Dummy', response: { displayName: 'Megan Bowen' } };
    const newState = authToken(initialState, dummyAction);

    expect(newState).toEqual(initialState);
  });

  it('should handle GET_AUTH_TOKEN_SUCCESS', () => {
    const initialState = {};

    const queryAction = { type: GET_AUTH_TOKEN_SUCCESS, response: 'a token' };
    const newState = authToken(initialState, queryAction);

    expect(newState).toEqual('a token');
  });
});
