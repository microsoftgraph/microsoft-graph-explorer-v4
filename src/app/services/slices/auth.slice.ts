import { BrowserAuthError } from '@azure/msal-browser';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authenticationWrapper } from '../../../modules/authentication';
import { getConsentAuthErrorHint } from '../../../modules/authentication/authentication-error-hints';
import { AppDispatch, ApplicationState } from '../../../store';
import { AuthenticateResult } from '../../../types/authentication';
import { Mode } from '../../../types/enums';
import { translateMessage } from '../../utils/translate-messages';
import { revokeScopes } from '../actions/revoke-scopes.action';
import { fetchAllPrincipalGrants } from './permission-grants.slice';
import { getProfileInfo } from './profile.slice';
import { setQueryResponseStatus } from './query-status.slice';

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
  },
  extraReducers: (builder) => {
    builder.addCase(consentToScopes.pending, (state) => {
      state.authToken.pending = true;
    });
    builder.addCase(consentToScopes.fulfilled, (state, action) => {
      state.authToken.pending = false;
      state.consentedScopes = action.payload!;
    });
    builder.addCase(consentToScopes.rejected, (state) => {
      state.authToken.pending = false;
    });
    builder.addCase(revokeScopes.pending, (state) => {
      state.authToken.pending = true;
    });
    builder.addCase(revokeScopes.fulfilled, (state, action) => {
      state.authToken.pending = false;
      state.consentedScopes = action.payload!;
    });
    builder.addCase(revokeScopes.rejected, (state) => {
      state.authToken.pending = false;
    });
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

const validateConsentedScopes = (scopeToBeConsented: string[], consentedScopes: string[],
  consentedResponse: string[]) => {
  if (!consentedScopes || !consentedResponse || !scopeToBeConsented) {
    return consentedResponse;
  }
  const expectedScopes = [...consentedScopes, ...scopeToBeConsented];
  if (expectedScopes.length === consentedResponse.length) {
    return consentedResponse;
  }
  return expectedScopes;
}

export const consentToScopes = createAsyncThunk(
  'auth/consentToScopes',
  async (scopes: string[], { dispatch, getState }) => {
    try {
      const { profile, auth: { consentedScopes } } = getState() as ApplicationState;
      const authResponse = await authenticationWrapper.consentToScopes(scopes);
      if (authResponse && authResponse.accessToken) {
        dispatch(getAuthTokenSuccess());
        const validatedScopes = validateConsentedScopes(scopes, consentedScopes, authResponse.scopes);
        if (authResponse.account && authResponse.account.localAccountId !== profile?.user?.id) {
          dispatch(getProfileInfo());
        }
        dispatch(
          setQueryResponseStatus({
            statusText: translateMessage('Success'),
            status: translateMessage('Scope consent successful'),
            ok: true,
            messageBarType: 'success'
          })
        );
        dispatch(fetchAllPrincipalGrants());
        return validatedScopes;
      }
    } catch (error: unknown) {
      const { errorCode } = error as BrowserAuthError;
      dispatch(
        setQueryResponseStatus({
          statusText: translateMessage('Scope consent failed'),
          status: errorCode,
          ok: false,
          messageBarType: 'error',
          hint: getConsentAuthErrorHint(errorCode)
        })
      );
    }
  }
);

export function signIn() {
  return (dispatch: AppDispatch) => dispatch(getAuthTokenSuccess());
}

export function storeScopes(consentedScopes: string[]) {
  return (dispatch: AppDispatch) => dispatch(getConsentedScopesSuccess(consentedScopes));
}

export default authSlice.reducer;
