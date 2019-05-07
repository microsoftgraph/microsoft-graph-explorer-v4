import { authToken } from '../../../app/services/reducers/auth-reducers';
import { GET_AUTH_TOKEN_SUCCESS } from '../../../app/services/redux-constants';

describe('Auth Reducer', () => {
  it('should return initial state', () => {
    const initialState = {};
    const dummyAction = { type: 'Dummy', response: { displayName: 'Megan Bowen' } };
    const newState = authToken(initialState, dummyAction);

    expect(newState).toEqual(initialState);
  });

  it('should handle AUTHENTICATE_USER', () => {
    const initialState = {};
    const authenticatedUser = {
      status: true,
      token: 'ex',
      user:
        {
          displayName: 'Megan Bowen',
          emailAddress: 'meganbowen@onmicrosoft.com',
          profileImageUrl: 'blob:http:',
        },
    };
    const mockUser = {
      authenticatedUser,
    };
    const queryAction = { type: GET_AUTH_TOKEN_SUCCESS, response: authenticatedUser };
    const newState = authToken(initialState, queryAction);

    expect(newState).toEqual(mockUser);
  });
});
