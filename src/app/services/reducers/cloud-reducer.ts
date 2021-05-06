import { globalCloud } from '../../../modules/cloud-resolver';
import { IAction } from '../../../types/action';
import { ICloud } from '../../../types/cloud';
import { SET_ACTIVE_CLOUD_SUCCESS } from '../redux-constants';

const initialState: ICloud = globalCloud;

export function cloud(state = initialState, action: IAction): ICloud {
  switch (action.type) {
    case SET_ACTIVE_CLOUD_SUCCESS:
      return action.response;

    default:
      return state;
  }
}
