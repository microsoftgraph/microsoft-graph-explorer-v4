import { IAction } from '../../../types/action';
import { FETCH_RESOURCES_SUCCESS, FETCH_RESOURCES_PENDING, FETCH_RESOURCES_ERROR } from '../redux-constants';
import { filterResourcePayloadByCloud } from '../../utils/resources/resource-payload-filter';
import content from '../../utils/resources/resources.json';

export function fetchResourcesSuccess(response: object): IAction {
  return {
    type: FETCH_RESOURCES_SUCCESS,
    response,
  };
}

export function fetchResourcesPending(): any {
  return {
    type: FETCH_RESOURCES_PENDING,
  };
}

export function fetchResourcesError(response: object): IAction {
  return {
    type: FETCH_RESOURCES_ERROR,
    response,
  };
}

export function fetchResources(): Function {
  return async (dispatch: Function) => {
    try {
      const clouds = ['v1.0-Prod', 'beta-Prod'];

      const filteredPayload = filterResourcePayloadByCloud(content, clouds);
      if (filteredPayload) {
        return dispatch(fetchResourcesSuccess(filteredPayload));
      }
      throw new Error("");
    } catch (error) {
      return dispatch(fetchResourcesError({ error }));
    }

    // try {
    //   const headers = {
    //     'Content-Type': 'application/json',
    //   };
    //   const options: IRequestOptions = { headers, method: 'POST' };
    //   dispatch(fetchResourcesPending());
    //   const response = await fetch(URI_SPACE_URL, options);
    //   if (response.ok) {
    //     const result = await response.json();
    //     const resources = filterResourcePayloadByCloud(result)
    //     return dispatch(fetchResourcesSuccess(resources!));
    //   }
    //   throw response;
    // } catch (error) {
    //   return dispatch(fetchResourcesError({ error }));

    // }
  };
}