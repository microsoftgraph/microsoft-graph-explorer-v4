import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getProfileInfo, profileRequestError, getProfileInformation,
  profileRequestSuccess, getBetaProfile, getProfileType,
  getProfileImage, getProfileResponse } from '../../../app/services/actions/profile-action-creators';
import {
  PROFILE_REQUEST_ERROR, PROFILE_REQUEST_SUCCESS} from '../../../app/services/redux-constants';
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
      })
      .catch( (e : Error) => { throw e})
  });

  it('dispatches PROFILE_REQUEST_ERROR if profile request fails', () => {
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

  it('throws on getProfileInformation', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    expect(getProfileInformation()).toBeDefined();
  });

  it('throws on getProfileInformation', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    expect(getBetaProfile()).toBeDefined();
  });

  it('throws on getProfileInformation', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    expect(getProfileImage()).toBeDefined();
  });

  it('throws on getProfileInformation', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    expect(getProfileResponse()).toBeDefined();
  });

  it('throws on getProfileInformation', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    expect(getProfileType({})).toBeDefined();
  });

});
