import { globalCloud } from '../../../modules/sovereign-clouds';
import { AppAction } from '../../../types/action';
import { ICloud } from '../../../types/cloud';
import { SET_ACTIVE_CLOUD_SUCCESS } from '../redux-constants';

const initialState: ICloud = globalCloud;

export function cloud(state = initialState, action: AppAction): ICloud {
  if (action.type === SET_ACTIVE_CLOUD_SUCCESS) {
    return action.response;
  }
  return state;
}
