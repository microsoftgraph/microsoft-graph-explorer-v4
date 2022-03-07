import { scopes } from '../../../app/services/reducers/permissions-reducer';
import {
  FETCH_SCOPES_ERROR, FETCH_SCOPES_PENDING,
  FETCH_FULL_SCOPES_SUCCESS,
  FETCH_URL_SCOPES_SUCCESS
} from '../../../app/services/redux-constants';

const initialState = {
  pending: false,
  data: {
    panelPermissions: [],
    tabPermissions: []
  },
  error: null
};

describe('Permissions reducer', () => {
  it('should handle FETCH_FULL_SCOPES_SUCCESS', () => {
    const action = {
      type: FETCH_FULL_SCOPES_SUCCESS,
      response: {
        scopes: {
          tabPermissions: [],
          panelPermissions: ['profile.read', 'profile.write', 'email.read', 'email.write']
        }
      }
    }

    const expectedState = {
      pending: false,
      data: {
        panelPermissions: ['profile.read', 'profile.write', 'email.read', 'email.write'],
        tabPermissions: []
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
          tabPermissions: ['profile.read', 'profile.write', 'email.read', 'email.write'],
          panelPermissions: []
        }
      }
    }

    const expectedState = {
      pending: false,
      data: {
        panelPermissions: [],
        tabPermissions: ['profile.read', 'profile.write', 'email.read', 'email.write']
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
      pending: false,
      data: {},
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
      data: {
        panelPermissions: [],
        tabPermissions: []
      },
      error: null
    }

    const newState = scopes(initialState, action);
    expect(newState).toEqual(expectedState);
  })
});