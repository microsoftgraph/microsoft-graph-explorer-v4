import { AppAction } from '../../../types/action';
import { TOGGLE_SIDEBAR_SUCCESS } from '../redux-constants';

export function toggleSidebar(response: object): AppAction {
  return {
    type: TOGGLE_SIDEBAR_SUCCESS,
    response
  };
}
