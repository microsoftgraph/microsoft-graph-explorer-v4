import { IAction, Mode } from '../../../types/action';
import { SET_GRAPH_EXPLORER_MODE_SUCCESS } from '../redux-constants';

export function graphExplorerMode(state = '', action: IAction): any {
  switch (action.type) {
    case SET_GRAPH_EXPLORER_MODE_SUCCESS:
      return action.response;
    default:
      return state;
  }
}
