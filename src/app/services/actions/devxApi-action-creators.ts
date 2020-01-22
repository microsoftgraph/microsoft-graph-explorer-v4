import { SET_DEVX_API_URL_SUCCESS } from '../redux-constants';

export function setDevxApiUrl(response: string): any {
  return {
    type: SET_DEVX_API_URL_SUCCESS,
    response,
  };
}
