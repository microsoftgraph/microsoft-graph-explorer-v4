import { IAction } from '../../../types/action';
import { QUERY_GRAPH_ERROR } from '../redux-constants';

export function queryRunnerError(state = {}, action: IAction) {
  switch (action.type) {
    case QUERY_GRAPH_ERROR:
      return action.response;
    default:
      return state;
  }
}
