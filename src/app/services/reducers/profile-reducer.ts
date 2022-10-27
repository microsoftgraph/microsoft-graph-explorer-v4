import { AppAction } from '../../../types/action';
import { LOGOUT_SUCCESS, PROFILE_REQUEST_SUCCESS } from '../redux-constants';

export function profile(state = null, action: AppAction): any {
  switch (action.type) {
    case LOGOUT_SUCCESS:
      return null;
    case PROFILE_REQUEST_SUCCESS:
      return action.response;
    default:
      return state;
  }
}
