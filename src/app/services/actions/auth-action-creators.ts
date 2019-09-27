import { IAction } from '../../../types/action';
import { MsalAuthProvider } from '../graph-client/MsalAuthProvider';
import { GET_AUTH_TOKEN_SUCCESS, LOGOUT_SUCCESS } from '../redux-constants';

export function getAuthTokenSuccess(response: string): IAction {
  return {
    type: GET_AUTH_TOKEN_SUCCESS,
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
  new MsalAuthProvider()
    .signOut();
  return (dispatch: Function) => dispatch(signOutSuccess(''));
}

export function signIn(token: string) {
  return (dispatch: Function) => dispatch(getAuthTokenSuccess(token));
}
