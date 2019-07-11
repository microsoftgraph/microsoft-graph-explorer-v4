import { IAction } from '../../../types/action';
import { GET_AUTH_TOKEN_SUCCESS, QUERY_RUN_RESPONSE } from '../redux-constants';

export function isLoginResponse(state = {}, action: IAction): any {
  switch (action.type) {
    case GET_AUTH_TOKEN_SUCCESS:
      return true;
    case QUERY_RUN_RESPONSE:
      return false;
    default:
      return state;
  }
}
