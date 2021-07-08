import { IQuery } from '../../../types/query-runner';
import { PROFILE_IMAGE_REQUEST_SUCCESS, PROFILE_REQUEST_ERROR, PROFILE_REQUEST_SUCCESS, PROFILE_TYPE_SUCCESS } from '../redux-constants';
import { authenticatedRequest, isBetaURLResponse, isImageResponse, parseResponse } from './query-action-creator-util';

export function profileRequestSuccess(response: object): any {
  return {
    type: PROFILE_REQUEST_SUCCESS,
    response,
  };
}

export function profileImageRequestSuccess(response: object): any {
  return {
    type: PROFILE_IMAGE_REQUEST_SUCCESS,
    response,
  };
}

export function profileRequestError(response: object): any {
  return {
    type: PROFILE_REQUEST_ERROR,
    response,
  };
}

export function profileTypeSuccess(response: any): any {
  return {
    type: PROFILE_TYPE_SUCCESS,
    response,
  }
}

export function getProfileInfo(query: IQuery): Function {
  return (dispatch: Function) => {
    const respHeaders: any = {};

    if (!query.sampleHeaders) {
      query.sampleHeaders = [];
    }

    query.sampleHeaders.push({
      name: 'Cache-Control',
      value: 'no-cache'
    });

    return authenticatedRequest(dispatch, query).then(async (response: Response) => {

      if (response && response.ok) {
        const json = await parseResponse(response, respHeaders);
        const contentType = respHeaders['content-type'];
        const isImageResult = isImageResponse(contentType);
        const betaUserInfo = isBetaURLResponse(json);

        if (isImageResult) {
          return dispatch(
            profileImageRequestSuccess(json),
          );
        } else if (betaUserInfo) {
          dispatch(
            profileTypeSuccess(betaUserInfo)
          );
        } else {
          return dispatch(
            profileRequestSuccess(json),
          );
        }
      }
      return dispatch(profileRequestError({ response }));
    });

  };
}
