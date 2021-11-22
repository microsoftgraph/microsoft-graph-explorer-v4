import { IAction } from '../../../types/action';
import { IGraphResponse } from '../../../types/query-response';
import {
  ANONYMOUS_QUERY_COUNTER,
  CLEAR_ANONYMOUS_QUERY_COUNTER,
  CLEAR_RESPONSE,
  PROFILE_REQUEST_SUCCESS,
  QUERY_GRAPH_RUNNING,
  QUERY_GRAPH_SUCCESS,
  VIEW_HISTORY_ITEM_SUCCESS
} from '../redux-constants';

const initialState: IGraphResponse = {
  body: undefined,
  headers: undefined
};

export function graphResponse(
  state: IGraphResponse = initialState,
  action: IAction
): any {
  switch (action.type) {
    case QUERY_GRAPH_SUCCESS:
      return action.response;
    case VIEW_HISTORY_ITEM_SUCCESS:
      return action.response;
    case QUERY_GRAPH_RUNNING:
      return initialState;
    case CLEAR_RESPONSE:
      return initialState;
    default:
      return state;
  }
}

export function anonymousRequestsCounter(state = 0, action: IAction) {
  switch (action.type) {
    case ANONYMOUS_QUERY_COUNTER:
      return state + 1;
    case CLEAR_ANONYMOUS_QUERY_COUNTER:
      return 0;
    case PROFILE_REQUEST_SUCCESS:
      return 0;
    default:
      return state
  }
}