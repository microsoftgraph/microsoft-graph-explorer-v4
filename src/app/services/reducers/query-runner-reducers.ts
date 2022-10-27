import { AppAction } from '../../../types/action';
import { IGraphResponse } from '../../../types/query-response';
import {
  CLEAR_RESPONSE,
  LOGOUT_SUCCESS,
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
  action: AppAction
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
    case LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
