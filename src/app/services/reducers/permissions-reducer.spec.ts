import { scopes } from '../../../app/services/reducers/permissions-reducer';
import {
  FETCH_SCOPES_ERROR, FETCH_FULL_SCOPES_PENDING,
  FETCH_FULL_SCOPES_SUCCESS,
  FETCH_URL_SCOPES_SUCCESS,
  FETCH_URL_SCOPES_PENDING
} from '../../../app/services/redux-constants';

const initialState = {
  pending: { isSpecificPermissions: false, isFullPermissions: false },
  data: {
    fullPermissions: [],
    specificPermissions: []
  },
  error: null
};

describe('Permissions reducer', () => {
  it('should handle FETCH_FULL_SCOPES_SUCCESS', () => {
    const action = {
      type: FETCH_FULL_SCOPES_SUCCESS,
      response: {
        scopes: {
          specificPermissions: [],
          fullPermissions: ['profile.read', 'profile.write', 'email.read', 'email.write']
        }
      }
    }

    const expectedState = {
      pending: { isSpecificPermissions: false, isFullPermissions: false },
      data: {
        fullPermissions: ['profile.read', 'profile.write', 'email.read', 'email.write'],
        specificPermissions: []
      },
      error: null
    }

    const newState = scopes(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle FETCH_URL_SCOPES_SUCCESS', () => {
    const action = {
      type: FETCH_URL_SCOPES_SUCCESS,
      response: {
        scopes: {
          specificPermissions: ['profile.read', 'profile.write', 'email.read', 'email.write'],
          fullPermissions: []
        }
      }
    }

    const expectedState = {
      pending: { isSpecificPermissions: false, isFullPermissions: false },
      data: {
        fullPermissions: [],
        specificPermissions: ['profile.read', 'profile.write', 'email.read', 'email.write']
      },
      error: null
    }

    const newState = scopes(initialState, action);
    expect(newState).toEqual(expectedState);
  })

  it('should handle FETCH_SCOPES_ERROR', () => {
    const action = {
      type: FETCH_SCOPES_ERROR,
      response: 'error'
    }
    const expectedState = {
      pending: { isSpecificPermissions: false, isFullPermissions: false },
      data: {
        specificPermissions: [],
        fullPermissions: [],
        tenantWidePermissionsGrant: []
      },
      error: 'error'
    }

    const newState = scopes(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle FETCH_FULL_SCOPES_PENDING', () => {
    const action = {
      type: FETCH_FULL_SCOPES_PENDING,
      response: ''
    }

    const expectedState = {
      pending: { isSpecificPermissions: false, isFullPermissions: true },
      data: {
        fullPermissions: [],
        specificPermissions: []
      },
      error: null
    }

    const newState = scopes(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle FETCH_URL_SCOPES_PENDING', () => {
    const action = {
      type: FETCH_URL_SCOPES_PENDING,
      response: ''
    }

    const expectedState = {
      pending: { isSpecificPermissions: true, isFullPermissions: false },
      data: {
        fullPermissions: [],
        specificPermissions: []
      },
      error: null
    }

    const newState = scopes(initialState, action);
    expect(newState).toEqual(expectedState);
  })
});