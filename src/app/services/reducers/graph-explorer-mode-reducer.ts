import { AppAction } from '../../../types/action';
import { Mode } from '../../../types/enums';
import { SET_GRAPH_EXPLORER_MODE_SUCCESS } from '../redux-constants';

export function graphExplorerMode(state = Mode.Complete, action: AppAction): any {
  switch (action.type) {
    case SET_GRAPH_EXPLORER_MODE_SUCCESS:
      return action.response;
    default:
      return state;
  }
}
