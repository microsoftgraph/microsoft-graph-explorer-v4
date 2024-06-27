import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authenticationWrapper } from '../../../modules/authentication';
import { Mode } from '../../../types/enums';
import { AppDispatch } from '../../../store';
import { ApplicationState } from '../../../types/root';
import { AuthenticateResult } from '../../../types/authentication';

const initialState: AuthenticateResult = {
  authToken: {
    pending: false,
    token: false
  },
  consentedScopes: []
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getAuthTokenSuccess(state) {
      state.authToken.token = true;
      state.authToken.pending = false;
    },
    signOutSuccess(state) {
      state.authToken.token = false;
      state.authToken.pending = false;
      state.consentedScopes = [];
    },
    setAuthenticationPending(state) {
      state.authToken.token = true;
      state.authToken.pending = true;
    },
    getConsentedScopesSuccess(state, action: PayloadAction<string[]>) {
      state.consentedScopes = action.payload;
    }
  }
});

export const { getAuthTokenSuccess, signOutSuccess,
  setAuthenticationPending, getConsentedScopesSuccess } = authSlice.actions;

export function signOut() {
  return (dispatch: AppDispatch, getState: Function) => {
    const state = getState() as ApplicationState;
    const { graphExplorerMode } = state;
    dispatch(setAuthenticationPending());
    if (graphExplorerMode === Mode.Complete) {
      authenticationWrapper.logOut();
    } else {
      authenticationWrapper.logOutPopUp();
    }
    dispatch(signOutSuccess());
  };
}

export function signIn() {
  return (dispatch: AppDispatch) => dispatch(getAuthTokenSuccess());
}

export function storeScopes(consentedScopes: string[]) {
  return (dispatch: AppDispatch) => dispatch(getConsentedScopesSuccess(consentedScopes));
}

export default authSlice.reducer;
