import { IAction } from '../../../types/action';
import { GET_AUTH_TOKEN_SUCCESS, LOGOUT_SUCCESS } from '../constants';
import { HelloAuthProvider } from '../graph-client/HelloAuthProvider';

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
  new HelloAuthProvider()
    .signOut();
  return (dispatch: Function) => dispatch(signOutSuccess(''));
}

