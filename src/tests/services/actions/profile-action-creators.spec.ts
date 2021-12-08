import {
  profileRequestSuccess, profileRequestError,
  getProfileType
} from '../../../app/services/actions/profile-action-creators';
import { ACCOUNT_TYPE } from '../../../app/services/graph-constants';
import { PROFILE_REQUEST_ERROR, PROFILE_REQUEST_SUCCESS } from '../../../app/services/redux-constants';
import { IUser } from '../../../types/profile';

describe('Profile action creators tests', () => {
  it('should return profile_request_success', () => {
    // Arrange
    const response: IUser = {
      displayName: 'Megan Bowen',
      emailAddress: 'megan@microsoft.com',
      profileImageUrl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
      profileType: ACCOUNT_TYPE.MSA,
      ageGroup: 0
    }

    const expectedAction = {
      type: PROFILE_REQUEST_SUCCESS,
      response
    }

    // Act
    const action = profileRequestSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('should return an error if profile request fails', () => {
    // Arrange
    const response = {};
    const expectedAction = {
      type: PROFILE_REQUEST_ERROR,
      response
    }

    // Act
    const action = profileRequestError(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })
})