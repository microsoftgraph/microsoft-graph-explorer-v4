import { authToken, consentedScopes } from '../../../app/services/reducers/auth-reducers';
import { GET_AUTH_TOKEN_SUCCESS, GET_CONSENTED_SCOPES_SUCCESS } from '../../../app/services/redux-constants';

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

  it('should handle LOGOUT_SUCCESS', () => {
    const initialState = { token: true, pending: false };

    const queryAction = { type: 'LOGOUT_SUCCESS', response: false };
    const newState = authToken(initialState, queryAction);

    expect(newState).toEqual({ token: false, pending: false });
  });

  it('should handle AUTHENTICATION_PENDING', () => {
    const initialState = { token: false, pending: false };

    const queryAction = { type: 'AUTHENTICATION_PENDING', response: true };
    const newState = authToken(initialState, queryAction);

    expect(newState).toEqual({ token: true, pending: true });
  });

  it('should handle GET_CONSENTED_SCOPES_SUCCESS', () => {
    const initialState = ['profile.read', 'profile.write', 'email.read'];
    const action_ = {
      type: GET_CONSENTED_SCOPES_SUCCESS,
      response: ['profile.read', 'profile.write', 'email.read', 'email.write']
    }
    const newState = consentedScopes(initialState, action_);
    expect(newState).toEqual(['profile.read', 'profile.write', 'email.read', 'email.write']);
  })
});
