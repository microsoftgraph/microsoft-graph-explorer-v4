import { IAction } from '../../../types/action';
import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../constants';

export function graphResponse(state = {}, action: IAction) {
  switch (action.type) {
    case QUERY_GRAPH_SUCCESS:
      return action.response;
    default:
      return state;
  }
}
