import { AppAction } from '../../../types/action';
import { SET_ACTIVE_CLOUD_SUCCESS } from '../redux-constants';

export function setActiveCloud(response: object): AppAction {
  return {
    type: SET_ACTIVE_CLOUD_SUCCESS,
    response
  };
}