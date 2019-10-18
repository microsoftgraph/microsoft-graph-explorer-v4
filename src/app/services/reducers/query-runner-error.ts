import { IAction } from '../../../types/action';
import { CLEAR_QUERY_ERROR, FETCH_SCOPES_ERROR,
  GET_CONSENT_ERROR, QUERY_GRAPH_RUNNING, QUERY_GRAPH_STATUS, QUERY_GRAPH_SUCCESS } from '../redux-constants';

export function queryRunnerStatus(state = {}, action: IAction): any {
  switch (action.type) {
    case QUERY_GRAPH_STATUS:
      return action.response;
    case FETCH_SCOPES_ERROR:
      return action.response;
    case GET_CONSENT_ERROR:
      return action.response;
    case QUERY_GRAPH_RUNNING:
      return null;
    case CLEAR_QUERY_ERROR:
      return null;
    default:
      return state;
  }
}
