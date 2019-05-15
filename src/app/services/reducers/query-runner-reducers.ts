import { IAction } from '../../../types/action';
import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../redux-constants';

export function graphResponse(state = {}, action: IAction): object {
  switch (action.type) {
    case QUERY_GRAPH_SUCCESS:
      if (typeof action.response !== 'string') {
        return action.response;
      }
    case QUERY_GRAPH_ERROR:
      if (typeof action.response !== 'string') {
        return action.response;
      }
    default:
      return state;
  }
}
