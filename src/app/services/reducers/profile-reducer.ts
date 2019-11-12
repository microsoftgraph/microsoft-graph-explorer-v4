import { IAction } from '../../../types/action';
import { LOGOUT_SUCCESS, PROFILE_REQUEST_ERROR, PROFILE_REQUEST_SUCCESS } from '../redux-constants';

export function profile(state = {}, action: IAction): any {
  switch (action.type) {
    case PROFILE_REQUEST_ERROR:
      return null;
    case LOGOUT_SUCCESS:
      return null;
    case PROFILE_REQUEST_SUCCESS:
      return action.response;
    default:
      return state;
  }
}
