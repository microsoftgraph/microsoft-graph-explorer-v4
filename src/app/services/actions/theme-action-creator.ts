import { Dispatch } from 'redux';
import { AppThunk } from '../../../store';
import { AppAction } from '../../../types/action';
import { CHANGE_THEME_SUCCESS } from '../redux-constants';

export function changeThemeSuccess(response: string): AppAction {
  return {
    type: CHANGE_THEME_SUCCESS,
    response
  };
}

export function changeTheme(theme: string): AppThunk {
  return (dispatch: Dispatch): any => {
    return dispatch(changeThemeSuccess(theme));
  };
}
