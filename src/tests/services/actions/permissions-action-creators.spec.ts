import {
  FETCH_SCOPES_ERROR,
  FETCH_SCOPES_PENDING,
  FETCH_SCOPES_SUCCESS,
  QUERY_GRAPH_STATUS
} from '../../../app/services/redux-constants';

import {
  fetchScopesSuccess, fetchScopesPending, fetchScopesError, getPermissionsScopeType, fetchScopes,
  consentToScopes
} from
  '../../../app/services/actions/permissions-action-creator';
import { IPermissionsResponse } from '../../../types/permissions';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetch from 'jest-fetch-mock';
const middleware = [thunk];
const mockStore = configureMockStore(middleware);
describe('tests permissions action creators', () => {
  it('tests fetchScopesSuccess', () => {
    // Arrange
    const response: IPermissionsResponse = {
      hasUrl: true,
      scopes: [
        {
          value: '',
          consentDescription: '',
          isAdmin: false,
          consented: true
        }
      ]
    }

    const expectedAction = {
      type: FETCH_SCOPES_SUCCESS,
      response
    }

    // Act
    const action = fetchScopesSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('tests fetchScopesError', () => {
    // Arrange
    const response = {
      hasUrl: true,
      error: {}
    }

    const expectedAction = {
      type: FETCH_SCOPES_ERROR,
      response
    }

    // Act
    const action = fetchScopesError(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('tests fetch scopes pending ', () => {
    // Arrange
    const expectedAction = {
      type: FETCH_SCOPES_PENDING
    }

    // Act
    const action = fetchScopesPending();

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('returns valid scope type given a user profile or with null', () => {
    // Arrange
    const expectedResult = 'DelegatedWork';

    // Act
    const result = getPermissionsScopeType(null);

    // Assert
    expect(result).toEqual(expectedResult);

  });

  it('Tests the fetchScopes function', () => {
    // Arrange
    const expectedActions = [
      {
        type: FETCH_SCOPES_ERROR
      }
    ]

    const response = {
      permissions: {}
    }
    const store = mockStore({});
    fetch.mockResponseOnce(JSON.stringify(response));

    // Act
    // @ts-ignore
    store.dispatch(fetchScopes())
      .then(() => {
        expect(store.getActions()[0].type).toEqual(FETCH_SCOPES_ERROR);
      })
  })

  // Revisit this test
  it('Tests consenting to scopes function', () => {
    // Arrange
    const expectedActions = [
      {
        type: QUERY_GRAPH_STATUS
      }
    ]

    const store = mockStore({});
    fetch.mockResponseOnce(JSON.stringify({}));

    // Act and Assert
    // @ts-ignore
    store.dispatch(consentToScopes([]))
      .then(() => {
        expect(store.getActions()[0].type).toEqual(QUERY_GRAPH_STATUS);
      })
  })
})