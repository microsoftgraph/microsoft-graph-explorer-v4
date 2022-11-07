import { AppAction } from '../../../types/action';
import { CLEAR_QUERY_STATUS,
  GET_CONSENT_ERROR, LOGOUT_SUCCESS, QUERY_GRAPH_RUNNING, QUERY_GRAPH_STATUS,
  VIEW_HISTORY_ITEM_SUCCESS } from '../redux-constants';

export function queryRunnerStatus(state = {}, action: AppAction): any {
  switch (action.type) {
    case QUERY_GRAPH_STATUS:
      return action.response;
    case GET_CONSENT_ERROR:
      return action.response;
    case QUERY_GRAPH_RUNNING:
      return null;
    case CLEAR_QUERY_STATUS:
      return null;
    case VIEW_HISTORY_ITEM_SUCCESS:
      return null;
    case LOGOUT_SUCCESS:
      return null;
    default:
      return state;
  }
}
