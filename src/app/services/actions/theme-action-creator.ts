import { Dispatch } from 'redux';
import { AppThunk } from '../../../store';

import { saveTheme } from '../../../themes/theme-utils';
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
    saveTheme(theme);
    return dispatch(changeThemeSuccess(theme));
  };
}
