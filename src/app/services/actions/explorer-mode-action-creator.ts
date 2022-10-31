import { AppAction } from '../../../types/action';
import { Mode } from '../../../types/enums';
import { SET_GRAPH_EXPLORER_MODE_SUCCESS } from '../redux-constants';

export function setGraphExplorerMode(mode: Mode): AppAction {
  return {
    type: SET_GRAPH_EXPLORER_MODE_SUCCESS,
    response: mode
  };
}
