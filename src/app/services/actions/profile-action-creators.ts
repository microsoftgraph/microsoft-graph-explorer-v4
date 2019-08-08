import { IQuery } from '../../../types/query-runner';
import { PROFILE_REQUEST_ERROR, PROFILE_REQUEST_SUCCESS } from '../redux-constants';
import { authenticatedRequest, parseResponse } from './query-action-creator-util';

export function profileRequestSuccess(response: object): any {
  return {
    type: PROFILE_REQUEST_SUCCESS,
    response,
  };
}

export function profileRequestError(response: object): any {
  return {
    type: PROFILE_REQUEST_ERROR,
    response,
  };
}

export function getProfileInfo(query: IQuery): Function {
  return (dispatch: Function) => {
    const respHeaders: any = {};

    return authenticatedRequest(dispatch, query).then(async (response: Response) => {

      if (response && response.ok) {
        const json = await parseResponse(response, respHeaders);
        return dispatch(
          profileRequestSuccess({
            body: json,
            headers: respHeaders
          }),
        );
      }
      return dispatch(profileRequestError({ response }));
    });

  };
}