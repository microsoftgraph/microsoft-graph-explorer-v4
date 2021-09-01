import { IAction } from '../../../types/action';
import { ACCOUNT_TYPE } from '../graph-constants';
import { LOGOUT_SUCCESS, PROFILE_REQUEST_SUCCESS, PROFILE_TYPE_SUCCESS } from '../redux-constants';

export function profile(state = null, action: IAction): any {
  switch (action.type) {
    case LOGOUT_SUCCESS:
      return null;
    case PROFILE_REQUEST_SUCCESS:
      return action.response;
    default:
      return state;
  }
}
