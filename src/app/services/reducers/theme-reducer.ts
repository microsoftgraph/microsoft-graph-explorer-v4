import { AppAction } from '../../../types/action';
import { CHANGE_THEME_SUCCESS } from '../redux-constants';

export function theme(state = {}, action: AppAction): string | object {
  switch (action.type) {
    case CHANGE_THEME_SUCCESS:
      return action.response;
    default:
      return state;
  }
}
