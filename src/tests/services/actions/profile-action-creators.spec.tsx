import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getProfileInfo, profileRequestError,
  profileRequestSuccess } from '../../../app/services/actions/profile-action-creators';
import { ACCOUNT_TYPE } from '../../../app/services/graph-constants';
import {
  PROFILE_REQUEST_ERROR, PROFILE_REQUEST_SUCCESS} from '../../../app/services/redux-constants';
import { IUser } from '../../../types/profile';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('creates PROFILE_REQUEST_SUCCESS when profileRequestSuccess is called', () => {

    const response = fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    const expectedAction = {
      type: PROFILE_REQUEST_SUCCESS,
      response
    };

    const action = profileRequestSuccess(response);
    expect(action).toEqual(expectedAction);
  });

  it('dispatches PROFILE_REQUEST_ERROR for failed requests', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    const store = mockStore({});
    // @ts-ignore
    return store.dispatch(getProfileInfo())
      .then(() => {
        const includesError = store.getActions().filter(k => k.type === PROFILE_REQUEST_ERROR)
        expect(!!includesError).toEqual(true);
      });
  });

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
  });

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
  });
});
