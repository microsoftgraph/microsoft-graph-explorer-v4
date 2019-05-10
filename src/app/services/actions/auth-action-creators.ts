import { IAction } from '../../../types/action';
import { HelloAuthProvider } from '../graph-client/HelloAuthProvider';
import { GET_AUTH_TOKEN_SUCCESS, LOGOUT_SUCCESS } from '../redux-constants';

export function getAuthTokenSuccess(response: string): IAction {
  return {
    type: GET_AUTH_TOKEN_SUCCESS,
    response,
  };
}

export function signOutSuccess(response: object): IAction {
  return {
    type: LOGOUT_SUCCESS,
    response,
  };
}

export function signOut() {
  new HelloAuthProvider()
    .signOut();
  return (dispatch: Function) => dispatch(signOutSuccess({}));
}

