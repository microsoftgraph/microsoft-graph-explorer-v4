import { scopes } from '../../../app/services/reducers/permissions-reducer';
import { FETCH_SCOPES_ERROR, FETCH_SCOPES_PENDING, FETCH_SCOPES_SUCCESS } from '../../../app/services/redux-constants';

const initialState = {
  pending: false,
  data: [],
  hasUrl: false,
  error: null
};

describe('Permissions reducer', () => {
  it('should handle FETCH_SCOPES_SUCCESS', () => {
    const action = {
      type: FETCH_SCOPES_SUCCESS,
      response: {
        hasUrl: false,
        scopes: ['profile.read', 'profile.write', 'email.read', 'email.write']
      }
    }

    const expectedState = {
      pending: false,
      data: ['profile.read', 'profile.write', 'email.read', 'email.write'],
      hasUrl: false,
      error: null
    }

    const newState = scopes(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle FETCH_SCOPES_ERROR', () => {
    const action = {
      type: FETCH_SCOPES_ERROR,
      response: 'error'
    }
    const expectedState = {
      pending: false,
      data: [],
      hasUrl: false,
      error: 'error'
    }

    const newState = scopes(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle FETCH_SCOPES_PENDING', () => {
    const action = {
      type: FETCH_SCOPES_PENDING,
      response: ''
    }

    const expectedState = {
      pending: true,
      data: [],
      hasUrl: false,
      error: null
    }

    const newState = scopes(initialState, action);
    expect(newState).toEqual(expectedState);
  })
});