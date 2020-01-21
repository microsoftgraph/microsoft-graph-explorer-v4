import { SET_GE_API_URL_SUCCESS } from '../redux-constants';

export function setGeApiUrl(response: string): any {
  return {
    type: SET_GE_API_URL_SUCCESS,
    response,
  };
}
