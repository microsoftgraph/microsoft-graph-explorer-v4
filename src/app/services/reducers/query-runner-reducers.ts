import { IAction } from '../../../types/action';
import { IGraphResponse } from '../../../types/query-response';
import {
  CLEAR_RESPONSE,
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
      console.log('Here is the item', action.response);
      return action.response;
    case QUERY_GRAPH_RUNNING:
      return initialState;
    case CLEAR_RESPONSE:
      return initialState;
    default:
      return state;
  }
}
