import {
  AUTHENTICATION_PENDING, GET_AUTH_TOKEN_SUCCESS, GET_CONSENTED_SCOPES_SUCCESS,
  LOGOUT_SUCCESS
} from '../../../app/services/redux-constants';

import {
  getAuthTokenSuccess, getConsentedScopesSuccess, signOutSuccess,
  setAuthenticationPending,
  storeScopes, signIn
} from '../../../app/services/actions/auth-action-creators';

import configureMockStore from 'redux-mock-store';

import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Auth Action Creators test', () => {
  it('tests the authentication pending action', () => {
    // Arrange
    const response: boolean = true;
    const expectedAction = {
      type: AUTHENTICATION_PENDING,
      response
    }

    // Act
    const action = setAuthenticationPending(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('tests the auth token success function', () => {
    // Arrange
    const response: boolean = true;
    const expectedAction = {
      type: GET_AUTH_TOKEN_SUCCESS,
      response
    }

    // Act
    const action = getAuthTokenSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('tests the scopes success action', () => {
    // Arrange
    const response: string[] = ['mail.read', 'profile.read'];
    const expectedAction = {
      type: GET_CONSENTED_SCOPES_SUCCESS,
      response
    }

    // Act
    const action = getConsentedScopesSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('tests sign out success action', () => {
    // Arrange
    const response: boolean = true;
    const expectedAction = {
      type: LOGOUT_SUCCESS,
      response
    }
    // Act
    const action = signOutSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('Dispatches getConsentedScopesSuccess when storeScopes is called', () => {
    // Arrange
    const response: string[] = ['mail.read', 'profile.read'];
    const expectedAction = {
      type: GET_CONSENTED_SCOPES_SUCCESS,
      response
    }

    // Act
    const store = mockStore({ consentedScopes: [] });

    // @ts-ignore
    store.dispatch(storeScopes(response));

    // Assert
    expect(store.getActions()).toEqual([expectedAction]);

  })

  it('It dispatches the getAuthTokenSuccess action creater when signIn is called', () => {
    // Arrange
    const response: boolean = true;
    const expectedAction = {
      type: GET_AUTH_TOKEN_SUCCESS,
      response
    }

    // Act
    const store = mockStore({ authToken: {} });

    // @ts-ignore
    store.dispatch(signIn(response));

    // Assert
    expect(store.getActions()).toEqual([expectedAction]);
  })

  it('Dispatches signout success when signOut is called', () => {
    // Arrange
    const response: boolean = false;
    const expectedAction = {
      type: LOGOUT_SUCCESS,
      response
    }

    // Act
    const store = mockStore({ authToken: {} });

    // @ts-ignore
    store.dispatch(signOutSuccess(response));

    // Assert
    expect(store.getActions()).toEqual([expectedAction]);

  })
})