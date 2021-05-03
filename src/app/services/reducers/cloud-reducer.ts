import { IAction } from '../../../types/action';
import { ICloud } from '../../../types/cloud';
import { AUTH_URL, GRAPH_URL } from '../graph-constants';
import { SET_ACTIVE_CLOUD_SUCCESS } from '../redux-constants';

const initialState: ICloud = {
  baseUrl: GRAPH_URL,
  locale: 'global',
  loginUrl: AUTH_URL,
  name: 'global'
}

export function cloud(state = initialState, action: IAction): ICloud {
  switch (action.type) {
    case SET_ACTIVE_CLOUD_SUCCESS:
      return action.response;

    default:
      return state;
  }
}
