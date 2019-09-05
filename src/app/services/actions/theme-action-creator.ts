import { IAction } from '../../../types/action';
import { CHANGE_THEME_SUCCESS } from '../redux-constants';
export function changeTheme(response: string): IAction {
  return {
    type: CHANGE_THEME_SUCCESS,
    response,
  };
}


