import { AppAction } from '../../../types/action';
import {
  FETCH_RESOURCES_SUCCESS, FETCH_RESOURCES_PENDING,
  FETCH_RESOURCES_ERROR, RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS
} from '../redux-constants';
import { IResource } from '../../../types/resources';
import { ApplicationState } from '../../../types/root';
import { IRequestOptions } from '../../../types/request';
import { resourcesCache } from '../../../modules/cache/resources.cache';

export function fetchResourcesSuccess(response: object): AppAction {
  return {
    type: FETCH_RESOURCES_SUCCESS,
    response
  };
}

export function fetchResourcesPending(): AppAction {
  return {
    type: FETCH_RESOURCES_PENDING,
    response: null
  };
}

export function fetchResourcesError(response: object): AppAction {
  return {
    type: FETCH_RESOURCES_ERROR,
    response
  };
}

export function addResourcePaths(response: object): AppAction {
  return {
    type: RESOURCEPATHS_ADD_SUCCESS,
    response
  };
}

export function removeResourcePaths(response: object): AppAction {
  return {
    type: RESOURCEPATHS_DELETE_SUCCESS,
    response
  };
}

export function fetchResources() {
  return async (dispatch: Function, getState: Function) => {
    const { devxApi }: ApplicationState = getState();
    const resourcesUrl = `${devxApi.baseUrl}/openapi/tre`;

    const headers = {
      'Content-Type': 'application/json'
    };

    const options: IRequestOptions = { headers };

    dispatch(fetchResourcesPending());

    try {
      const cachedResources = await resourcesCache.readResources();
      if (cachedResources.length !== 0){
        return dispatch(fetchResourcesSuccess(cachedResources));
      }
    } catch (error) {
      const response = await fetch(resourcesUrl, options);
      if (response.ok) {
        const resources = await response.json() as IResource;
        return dispatch(fetchResourcesSuccess(resources));
      }
      return dispatch(fetchResourcesError({ error }));
    }
  };
}