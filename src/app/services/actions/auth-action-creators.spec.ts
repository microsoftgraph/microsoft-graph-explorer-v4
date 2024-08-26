import { PayloadAction } from '@reduxjs/toolkit';
import configureMockStore from 'redux-mock-store';
import {
  AUTHENTICATION_PENDING, GET_AUTH_TOKEN_SUCCESS, GET_CONSENTED_SCOPES_SUCCESS,
  LOGOUT_SUCCESS
} from '../../../app/services/redux-constants';
import {
  getAuthTokenSuccess, getConsentedScopesSuccess,
  setAuthenticationPending,
  signIn, signOut,
  signOutSuccess,
  storeScopes
} from '../../../app/services/slices/auth.slice';
import { msalApplication } from '../../../modules/authentication/msal-app';
import { HOME_ACCOUNT_KEY } from '../graph-constants';
import { mockThunkMiddleware } from './mockThunkMiddleware';

const mockStore = configureMockStore([mockThunkMiddleware]);

window.open = jest.fn();
jest.spyOn(window.sessionStorage.__proto__, 'clear');

jest.spyOn(window.localStorage.__proto__, 'setItem');
jest.spyOn(window.localStorage.__proto__, 'getItem');
jest.spyOn(window.localStorage.__proto__, 'removeItem');

window.localStorage.setItem(HOME_ACCOUNT_KEY, '1234567');
msalApplication.logoutPopup = jest.fn();

describe('Auth Action Creators', () => {
  it('should dispatch AUTHENTICATION_PENDING when setAuthenticationPending() is called', () => {
    // Arrange
    const expectedAction: PayloadAction<undefined> = {
      type: AUTHENTICATION_PENDING,
      payload: undefined
    }

    // Act
    const action = setAuthenticationPending();

    // Assert
    expect(action).toEqual(expectedAction);
  });

  it('should dispatch GET_AUTH_TOKEN_SUCCESS when getAuthTokenSuccess() is called', () => {
    // Arrange
    const expectedAction: PayloadAction<undefined> = {
      type: GET_AUTH_TOKEN_SUCCESS,
      payload: undefined
    }

    // Act
    const action = getAuthTokenSuccess();

    // Assert
    expect(action).toEqual(expectedAction);
  });

  it('should dispatch GET_CONSENTED_SCOPES_SUCCESS when getConsentedScopesSuccess() is called', () => {
    // Arrange
    const response: string[] = ['mail.read', 'profile.read'];
    const expectedAction: PayloadAction<string[]> = {
      type: GET_CONSENTED_SCOPES_SUCCESS,
      payload: response
    }

    // Act
    const action = getConsentedScopesSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  });

  it('should dispatch LOGOUT_SUCCESS when signOutSuccess() is called', () => {
    // Arrange
    const expectedAction: PayloadAction<undefined> = {
      type: LOGOUT_SUCCESS,
      payload: undefined
    }
    // Act
    const action = signOutSuccess();

    // Assert
    expect(action).toEqual(expectedAction);
  });

  it('should dispatch GET_CONSENTED_SCOPES_SUCCESS when storeScopes() is called', () => {
    // Arrange
    const response: string[] = ['mail.read', 'profile.read'];
    const expectedAction: PayloadAction<string[]> = {
      type: GET_CONSENTED_SCOPES_SUCCESS,
      payload: response
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
    const expectedAction: PayloadAction<undefined> = {
      type: GET_AUTH_TOKEN_SUCCESS,
      payload: undefined
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
    const expectedAction: PayloadAction<boolean> = {
      type: LOGOUT_SUCCESS,
      payload: response
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
    // Mock the fetch function
    global.fetch = jest.fn();

    window.open = jest.fn();
    const store = mockStore({});
    const expectedActions = [
      {
        type: AUTHENTICATION_PENDING,
        payload: undefined
      },
      {
        type: LOGOUT_SUCCESS,
        payload: undefined
      }
    ];
    // Act and assert
    // home account key is available before signing out
    expect(window.localStorage.getItem(HOME_ACCOUNT_KEY)).toBe('1234567');
    //@ts-ignore
    store.dispatch(signOut());
    const actions = store.getActions();

    // logoutPop launches a popup window and deleted homeAccountKey.
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(HOME_ACCOUNT_KEY);

    // after signing out, the home account key is removed
    expect(window.localStorage.getItem(HOME_ACCOUNT_KEY)).toBe(null);
    expect(actions).toEqual(expectedActions);

  });
})