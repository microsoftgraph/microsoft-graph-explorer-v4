import { IAction } from '../../../types/action';
import { PROFILE_REQUEST_SUCCESS } from '../redux-constants';

export function isProfileRequest(state = {}, action: IAction): any {
  switch (action.type) {
    case PROFILE_REQUEST_SUCCESS:
      return !!action.response;
    default:
      return state;
  }
}
