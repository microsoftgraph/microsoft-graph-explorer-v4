import { AppAction } from '../../../types/action';
import { CHANGE_THEME_SUCCESS } from '../redux-constants';

export function changeTheme(response: string): AppAction {
  return {
    type: CHANGE_THEME_SUCCESS,
    response
  };
}