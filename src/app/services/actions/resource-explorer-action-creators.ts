import { IAction } from '../../../types/action';
import {
  FETCH_RESOURCES_SUCCESS, FETCH_RESOURCES_PENDING,
  FETCH_RESOURCES_ERROR, RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS
} from '../redux-constants';
import { IResource } from '../../../types/resources';
import { IRootState } from '../../../types/root';
import { IRequestOptions } from '../../../types/request';

export function fetchResourcesSuccess(response: object): IAction {
  return {
    type: FETCH_RESOURCES_SUCCESS,
    response
  };
}

export function fetchResourcesPending(): any {
  return {
    type: FETCH_RESOURCES_PENDING
  };
}

export function fetchResourcesError(response: object): IAction {
  return {
    type: FETCH_RESOURCES_ERROR,
    response
  };
}

export function addResourcePaths(response: object): IAction {
  return {
    type: RESOURCEPATHS_ADD_SUCCESS,
    response
  };
}

export function removeResourcePaths(response: object): IAction {
  return {
    type: RESOURCEPATHS_DELETE_SUCCESS,
    response
  };
}

export function fetchResources(): Function {
  return async (dispatch: Function, getState: Function) => {
    try {
      const { devxApi }: IRootState = getState();
      const resourcesUrl = `${devxApi.baseUrl}/openapi/tree`;

      const headers = {
        'Content-Type': 'application/json'
      };

      const options: IRequestOptions = { headers };

      dispatch(fetchResourcesPending());

      const response = await fetch(resourcesUrl, options);
      if (response.ok) {
        const resources = await response.json() as IResource;
        return dispatch(fetchResourcesSuccess(resources));
      }
      throw response;
    } catch (error) {
      return dispatch(fetchResourcesError({ error }));
    }
  };
}