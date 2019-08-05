import { PROFILE_REQUEST_SUCCESS } from '../redux-constants';

export function profileRequestSuccess(response: boolean): any {
  return {
    type: PROFILE_REQUEST_SUCCESS,
    response,
  };
}