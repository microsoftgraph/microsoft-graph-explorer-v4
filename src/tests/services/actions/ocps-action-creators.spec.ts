import { GET_POLICY_ERROR, GET_POLICY_PENDING, GET_POLICY_SUCCESS } from '../../../app/services/redux-constants';
import {
  getPoliciesSuccess, getPoliciesError, getPoliciesPending
} from '../../../app/services/actions/ocps-action-creators';

describe('Tests OCPS action creators', () => {
  it('tests response with valid policies object ', () => {
    // Arrange
    const response = {
      email: 1,
      screenshot: 1,
      feedback: 20
    }
    const expectedAction = {
      type: GET_POLICY_SUCCESS,
      response
    }

    // Act
    const action = getPoliciesSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('tests the error object response when policies fetch fails', () => {
    // Arrange
    const error = {};
    const expectedAction = {
      type: GET_POLICY_ERROR,
      response: error
    }

    // Act
    const action = getPoliciesError(error);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('tests get policies pending', () => {
    // Arrange
    const expectedAction = {
      type: GET_POLICY_PENDING
    }

    // Act
    const action = getPoliciesPending();

    // Assert
    expect(action).toEqual(expectedAction);
  })
})