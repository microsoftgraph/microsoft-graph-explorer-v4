import { IAction } from '../../../types/action';
import { HEADER_ADD, HEADER_REMOVE } from '../redux-constants';

export function addRequestHeader(response: object): IAction {
  return {
    type: HEADER_ADD,
    response,
  };
}

export function removeRequestHeader(response: object): IAction {
  return {
    type: HEADER_REMOVE,
    response,
  };
}

