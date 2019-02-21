import { IAction } from '../../../types/query-runner';
import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../constants';

export function queryRunner(state = {}, action: IAction) {
  switch (action.type) {
    case QUERY_GRAPH_SUCCESS:
      return action.response;
    default:
      return state;
  }
}
