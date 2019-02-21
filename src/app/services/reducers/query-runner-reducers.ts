import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../constants';

export function queryRunner(state = {}, action: any) {
  switch (action.type) {
    case QUERY_GRAPH_SUCCESS:
      return action.response;
    default:
      return state;
  }
}
