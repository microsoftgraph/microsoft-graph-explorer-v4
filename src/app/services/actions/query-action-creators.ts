import { IQuery } from '../../../types/query-runner';
import { QUERY_RUN_RESPONSE } from '../redux-constants';
import {
  anonymousRequest,
  authenticatedRequest
} from './query-action-creator-util';

export function runQueryResponse () {
  return (dispatch: Function)  => {
    dispatch({type: QUERY_RUN_RESPONSE})
  }
}
export function runQuery(query: IQuery): Function {
  return (dispatch: Function, getState: Function) => {
    const tokenPresent = getState().authToken;

    if (tokenPresent) {
      return authenticatedRequest(dispatch, query);
    }

    return anonymousRequest(dispatch, query);
  };
}
