import { IAction } from '../../../types/action';
import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../redux-constants';

export function queryRunnerError(state = {}, action: IAction): any {
  switch (action.type) {
    case QUERY_GRAPH_ERROR:
      return action.response;
    case QUERY_GRAPH_SUCCESS:
      return null;
    default:
      return state;
  }
}
