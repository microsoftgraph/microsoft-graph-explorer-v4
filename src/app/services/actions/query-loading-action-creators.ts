import { AppAction } from '../../../types/action';
import { QUERY_GRAPH_RUNNING } from '../redux-constants';

export function queryRunningStatus(response: boolean): AppAction {
  return {
    type: QUERY_GRAPH_RUNNING,
    response
  };
}