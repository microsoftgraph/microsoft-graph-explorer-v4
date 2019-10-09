import { IAction } from '../../../types/action';
import {
  PROFILE_REQUEST_ERROR, PROFILE_REQUEST_SUCCESS,
  QUERY_GRAPH_ERROR, QUERY_GRAPH_RUNNING, QUERY_GRAPH_SUCCESS, SCOPES_FETCH_ERROR
} from '../redux-constants';

export function isLoadingData(state = {}, action: IAction): any {
  switch (action.type) {
    case QUERY_GRAPH_RUNNING:
      if (action.response) {
        return action.response;
      }
    case QUERY_GRAPH_SUCCESS:
      return false;
    case QUERY_GRAPH_ERROR:
      return false;
    case SCOPES_FETCH_ERROR:
      return false;
    case PROFILE_REQUEST_ERROR:
      return false;
    case PROFILE_REQUEST_SUCCESS:
      return false;
    default:
      return state;
  }
}
