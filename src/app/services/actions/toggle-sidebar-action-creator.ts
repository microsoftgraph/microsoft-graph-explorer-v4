import { IAction } from '../../../types/action';
import { TOGGLE_SIDEBAR_SUCCESS } from '../redux-constants';

export function toggleSidebar(response: object): IAction {
  return {
    type: TOGGLE_SIDEBAR_SUCCESS,
    response,
  };
}
