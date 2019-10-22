import { IAction } from '../../../types/action';
import { CLEAR_RESPONSE, QUERY_GRAPH_SUCCESS,
  SET_SAMPLE_QUERY_SUCCESS, VIEW_HISTORY_ITEM_SUCCESS } from '../redux-constants';

export function graphResponse(state = {}, action: IAction): any {
  switch (action.type) {
    case QUERY_GRAPH_SUCCESS:
      return action.response;
    case VIEW_HISTORY_ITEM_SUCCESS:
      return action.response;
    case SET_SAMPLE_QUERY_SUCCESS:
      return { body: undefined, headers: undefined };
    case CLEAR_RESPONSE:
        return { body: undefined, headers: undefined };
    default:
      return state;
  }
}
