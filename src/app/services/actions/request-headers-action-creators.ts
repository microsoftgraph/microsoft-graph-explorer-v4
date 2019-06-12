import { IAction } from '../../../types/action';
import { HEADER_ADD_SUCCESS, HEADER_REMOVE_SUCCESS } from '../redux-constants';

export function addRequestHeader(response: object): IAction {
  return {
    type: HEADER_ADD_SUCCESS,
    response,
  };
}

export function removeRequestHeader(response: object): IAction {
  return {
    type: HEADER_REMOVE_SUCCESS,
    response,
  };
}

