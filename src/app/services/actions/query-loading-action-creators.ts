import { QUERY_GRAPH_RUNNING } from '../redux-constants';

export function queryRunningStatus(response: boolean): any {
    return {
      type: QUERY_GRAPH_RUNNING,
      response,
    };
  }