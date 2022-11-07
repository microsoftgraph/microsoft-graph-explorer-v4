import { AppAction } from '../../../types/action';
import { SET_DEVX_API_URL_SUCCESS } from '../redux-constants';

export function setDevxApiUrl(response: object): AppAction {
  return {
    type: SET_DEVX_API_URL_SUCCESS,
    response
  };
}
