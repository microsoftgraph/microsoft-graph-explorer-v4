import { IAction } from '../../../types/action';
import { SET_ACTION_TYPES_SUCCESS } from '../redux-constants';

export function saveActionTypes(state = [], action: IAction) {
  switch (action.type) {
    case SET_ACTION_TYPES_SUCCESS:
      return action.response
    default:
      return state;

  }
}