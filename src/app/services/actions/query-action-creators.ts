import { IQuery } from '../../../types/query-runner';
import { anonymousRequest, authenticatedRequest } from './query-action-creator-util';

export function runQuery(query: IQuery): Function {
  return (dispatch: Function, getState: Function) => {
    const tokenPresent = !(typeof getState().authToken === 'object');

    if (tokenPresent) {
      return authenticatedRequest(dispatch, query);
    }

    return anonymousRequest(dispatch, query);
  };
}
