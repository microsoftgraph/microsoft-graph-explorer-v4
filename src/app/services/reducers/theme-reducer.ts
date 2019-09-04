import { IAction } from '../../../types/action';
import { CHANGE_THEME_SUCCESS } from '../redux-constants';

export function theme(state = {}, action: IAction): string | object {
  switch (action.type) {
    case CHANGE_THEME_SUCCESS:
      return action.response;
    default:
      return state;
  }
}
