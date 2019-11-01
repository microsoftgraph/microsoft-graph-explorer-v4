import { IAction } from '../../../types/action';
import { logOut } from '../graph-client/MsalService';
import { GET_AUTH_TOKEN_SUCCESS, GET_CONSENTED_SCOPES_SUCCESS, LOGOUT_SUCCESS } from '../redux-constants';

export function getAuthTokenSuccess(response: string): IAction {
  return {
    type: GET_AUTH_TOKEN_SUCCESS,
    response,
  };
}
export function getConsentedScopesSuccess(response: string[]): IAction {
  return {
    type: GET_CONSENTED_SCOPES_SUCCESS,
    response,
  };
}

export function signOutSuccess(response: string): IAction {
  return {
    type: LOGOUT_SUCCESS,
    response,
  };
}

export function signOut() {
  logOut();
  return (dispatch: Function) => dispatch(signOutSuccess(''));
}

export function signIn(token: string) {
  return (dispatch: Function) => dispatch(getAuthTokenSuccess(token));
}

export function storeScopes(consentedScopes: string[]) {
  return (dispatch: Function) => dispatch(getConsentedScopesSuccess(consentedScopes));
}
