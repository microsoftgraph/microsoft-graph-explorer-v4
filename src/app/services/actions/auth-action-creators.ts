import { IAction } from '../../../types/action';
import { GET_AUTH_TOKEN_SUCCESS } from '../constants';

export function getAuthTokenSuccess(response: string): IAction {
  return {
    type: GET_AUTH_TOKEN_SUCCESS,
    response,
  };
}

