import { IAction } from '../../../types/action';
import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../redux-constants';

export function graphResponse(state = {}, action: IAction): any {
  switch (action.type) {
    case QUERY_GRAPH_SUCCESS:
      return action.response;
      case QUERY_GRAPH_ERROR:
        return { body: {}, headers: {} };
    default:
      return state;
  }
}
