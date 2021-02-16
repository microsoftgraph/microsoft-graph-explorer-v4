import { IAction } from '../../../types/action';
import { Mode } from '../../../types/enums';
import { logOut, logOutPopUp } from '../graph-client/msal-service';
import { GET_AUTH_TOKEN_SUCCESS, GET_CONSENTED_SCOPES_SUCCESS, LOGOUT_SUCCESS } from '../redux-constants';

export function getAuthTokenSuccess(response: boolean): any {
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

export function signOutSuccess(response: boolean): any {
  return {
    type: LOGOUT_SUCCESS,
    response,
  };
}

export function signOut() {
  return (dispatch: Function, getState: Function) => {
    const { graphExplorerMode } = getState();
    if (graphExplorerMode === Mode.Complete) {
      logOut();
    } else {
      logOutPopUp();
    }
    dispatch(signOutSuccess(false));
  };
}

export function signIn() {
  return (dispatch: Function) => dispatch(getAuthTokenSuccess(true));
}

export function storeScopes(consentedScopes: string[]) {
  return (dispatch: Function) => dispatch(getConsentedScopesSuccess(consentedScopes));
}
