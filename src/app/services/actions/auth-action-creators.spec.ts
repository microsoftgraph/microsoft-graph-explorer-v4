import {
  AUTHENTICATION_PENDING, GET_AUTH_TOKEN_SUCCESS, GET_CONSENTED_SCOPES_SUCCESS,
  LOGOUT_SUCCESS
} from '../../../app/services/redux-constants';

import {
  getAuthTokenSuccess, getConsentedScopesSuccess, signOutSuccess,
  setAuthenticationPending,
  storeScopes, signIn, signOut
} from '../../../app/services/actions/auth-action-creators';
import { AppAction } from '../../../types/action';

import configureMockStore from 'redux-mock-store';

import thunk from 'redux-thunk';
import { HOME_ACCOUNT_KEY } from '../graph-constants';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
window.open = jest.fn();
jest.spyOn(window.sessionStorage.__proto__, 'clear');

jest.spyOn(window.localStorage.__proto__, 'setItem');
jest.spyOn(window.localStorage.__proto__, 'getItem');
jest.spyOn(window.localStorage.__proto__, 'removeItem');

window.localStorage.setItem(HOME_ACCOUNT_KEY, '1234567');

describe('Auth Action Creators', () => {
  it('should dispatch AUTHENTICATION_PENDING when setAuthenticationPending() is called', () => {
    // Arrange
    const response: boolean = true;
    const expectedAction: AppAction = {
      type: AUTHENTICATION_PENDING,
      response
    }

    // Act
    const action = setAuthenticationPending(response);

    // Assert
    expect(action).toEqual(expectedAction);
  });

  it('should dispatch GET_AUTH_TOKEN_SUCCESS when getAuthTokenSuccess() is called', () => {
    // Arrange
    const response: boolean = true;
    const expectedAction: AppAction = {
      type: GET_AUTH_TOKEN_SUCCESS,
      response
    }

    // Act
    const action = getAuthTokenSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  });

  it('should dispatch GET_CONSENTED_SCOPES_SUCCESS when getConsentedScopesSuccess() is called', () => {
    // Arrange
    const response: string[] = ['mail.read', 'profile.read'];
    const expectedAction: AppAction = {
      type: GET_CONSENTED_SCOPES_SUCCESS,
      response
    }

    // Act
    const action = getConsentedScopesSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  });

  it('should dispatch LOGOUT_SUCCESS when signOutSuccess() is called', () => {
    // Arrange
    const response: boolean = true;
    const expectedAction: AppAction = {
      type: LOGOUT_SUCCESS,
      response
    }
    // Act
    const action = signOutSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  });

  it('should dispatch GET_CONSENTED_SCOPES_SUCCESS when storeScopes() is called', () => {
    // Arrange
    const response: string[] = ['mail.read', 'profile.read'];
    const expectedAction: AppAction = {
      type: GET_CONSENTED_SCOPES_SUCCESS,
      response
    }

    // Act
    const store = mockStore({ consentedScopes: [] });

    // @ts-ignore
    store.dispatch(storeScopes(response));

    // Assert
    expect(store.getActions()).toEqual([expectedAction]);

  });

  it('should dispatch GET_AUTH_TOKEN_SUCCESS when signIn() is called', () => {
    // Arrange
    const response: boolean = true;
    const expectedAction: AppAction = {
      type: GET_AUTH_TOKEN_SUCCESS,
      response
    }

    // Act
    const store = mockStore({ authToken: {} });

    // @ts-ignore
    store.dispatch(signIn());

    // Assert
    expect(store.getActions()).toEqual([expectedAction]);
  });

  it('should dispatch LOGOUT_SUCCESS when signOutSuccess() is called', () => {
    // Arrange
    const response: boolean = true;
    const expectedAction: AppAction = {
      type: LOGOUT_SUCCESS,
      response
    }

    // Act
    const store = mockStore({ authToken: {} });

    // @ts-ignore
    store.dispatch(signOutSuccess(response));

    // Assert
    expect(store.getActions()).toEqual([expectedAction]);

  });

  it('should confirm that a user can sign out', () => {
    // Arrange
    window.open = jest.fn();
    const store = mockStore({});
    const expectedActions = [
      {
        type: AUTHENTICATION_PENDING,
        response: true
      },
      {
        type: LOGOUT_SUCCESS,
        response: true
      }
    ];
    // Act and assert
    // home account key is available before signing out
    expect(window.localStorage.getItem(HOME_ACCOUNT_KEY)).toBe('1234567');
    //@ts-ignore
    store.dispatch(signOut())
    const actions = store.getActions();

    // logoutPop launches a popup window.
    expect(window.open).toHaveBeenCalled();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(HOME_ACCOUNT_KEY);

    // after signing out, the home account key is removed
    expect(window.localStorage.getItem(HOME_ACCOUNT_KEY)).toBe(null);
    expect(actions).toEqual(expectedActions);

  });
})