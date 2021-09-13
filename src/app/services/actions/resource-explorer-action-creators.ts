import { IAction } from '../../../types/action';
import { IRequestOptions } from '../../../types/request';
import { URI_SPACE_URL } from '../graph-constants';
import { FETCH_RESOURCES_SUCCESS, FETCH_RESOURCES_PENDING, FETCH_RESOURCES_ERROR } from '../redux-constants';

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
      const headers = {
        'Content-Type': 'application/json',
      };
      const options: IRequestOptions = { headers, method: 'POST' };
      dispatch(fetchResourcesPending());
      const response = await fetch(URI_SPACE_URL, options);
      if (response.ok) {
        const resources = await response.json();
        return dispatch(fetchResourcesSuccess(resources));
      }
      throw response;
    } catch (error) {
      return dispatch(fetchResourcesError({ error }));
    }
  };
}