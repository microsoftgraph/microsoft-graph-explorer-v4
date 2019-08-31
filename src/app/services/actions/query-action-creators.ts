import { IQuery } from '../../../types/query-runner';
import { queryResponseError } from './error-action-creator';
import { anonymousRequest, authenticatedRequest, parseResponse, queryResponse } from './query-action-creator-util';

export function runQuery(query: IQuery): Function {
  return (dispatch: Function, getState: Function) => {
    const tokenPresent = getState().authToken;
    const respHeaders: any = {};

    if (tokenPresent) {
      return authenticatedRequest(dispatch, query).then(async (response: Response) => {

        if (response && response.ok) {
          const result = await parseResponse(response, respHeaders);
          return dispatch(
            queryResponse({
              body: result,
              headers: respHeaders
            }),
          );
        }
        return dispatch(queryResponseError(response));
      });
    }

    return anonymousRequest(dispatch, query);
  };
}
