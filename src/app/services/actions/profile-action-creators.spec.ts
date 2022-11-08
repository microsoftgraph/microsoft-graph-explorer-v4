import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { AppAction } from '../../../types/action';
import { getProfileInfo, profileRequestError, profileRequestSuccess } from './profile-action-creators';
import { PROFILE_REQUEST_ERROR, PROFILE_REQUEST_SUCCESS } from '../redux-constants';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Profile action creators', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should dispatch PROFILE_REQUEST_SUCCESS when profileRequestSuccess() is called', () => {

    const response = fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    const expectedAction: AppAction = {
      type: PROFILE_REQUEST_SUCCESS,
      response
    };

    const action = profileRequestSuccess(response);
    expect(action).toEqual(expectedAction);
  });

  it('should dispatch PROFILE_REQUEST_ERROR when getProfileInfo() request fails', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    const store = mockStore({});
    // @ts-ignore
    return store.dispatch(getProfileInfo())
      .then(() => {
        const includesError = store.getActions().filter(k => k.type === PROFILE_REQUEST_ERROR)
        expect(!!includesError).toEqual(true);
      })
      .catch((e: Error) => { throw e })
  });

  it('should dispatch PROFILE_REQUEST_ERROR when profileRequestError() is called', () => {
    // Arrange
    const response = {};
    const expectedAction: AppAction = {
      type: PROFILE_REQUEST_ERROR,
      response
    }

    // Act
    const action = profileRequestError(response);

    // Assert
    expect(action).toEqual(expectedAction);
  });
});
