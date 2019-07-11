import { IAction, Mode } from '../../../types/action';
import { SET_GRAPH_EXPLORER_MODE_SUCCESS } from '../redux-constants';

export function graphExplorerMode(state = {}, action: IAction): Mode {
  switch (action.type) {
    case SET_GRAPH_EXPLORER_MODE_SUCCESS:
      if (action.response === Mode.TryIt) {
        return Mode.TryIt;
      } else {
        return Mode.Complete;
      }
    default:
      return Mode.Complete;
  }
}
