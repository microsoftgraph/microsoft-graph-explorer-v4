import { IQuery } from '../../../types/query-runner';
import { anonymousRequest, authenticatedRequest } from './query-action-creator-util';

export function runQuery(query: IQuery): Function {
  return (dispatch: Function, getState: Function) => {
    const authState = getState().authResponse;
    if (authState) {
      const isAuthenticated = authState.authenticatedUser;

      if (isAuthenticated) {
        return authenticatedRequest(dispatch, query);
      }
    }

    return anonymousRequest(dispatch, query);
  };
}
