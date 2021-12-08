import {
  FETCH_SCOPES_ERROR,
  FETCH_SCOPES_PENDING,
  FETCH_SCOPES_SUCCESS
} from '../../../app/services/redux-constants';

import { fetchScopesSuccess, fetchScopesPending, fetchScopesError, getPermissionsScopeType } from
  '../../../app/services/actions/permissions-action-creator';
import { IPermissionsResponse } from '../../../types/permissions';

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

  }
  )

})