import { IAction, Mode } from '../../../types/action';
import { HelloAuthProvider } from '../graph-client/HelloAuthProvider';
import { GET_AUTH_TOKEN_SUCCESS, LOGOUT_SUCCESS, SET_GRAPH_EXPLORER_MODE_SUCCESS } from '../redux-constants';

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

export function setGraphExplorerMode(mode: Mode) {
  return {
    type: SET_GRAPH_EXPLORER_MODE_SUCCESS,
    response: mode,
  };
}
