import { resourcesCache } from '../../../modules/cache/resources.cache';
import { AppAction } from '../../../types/action';
import { IRequestOptions } from '../../../types/request';
import { IResource } from '../../../types/resources';
import { ApplicationState } from '../../../types/root';
import {
  FETCH_RESOURCES_ERROR,
  FETCH_RESOURCES_PENDING,
  FETCH_RESOURCES_SUCCESS
} from '../redux-constants';

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

export function fetchResources() {
  return async (dispatch: Function, getState: Function) => {
    const { devxApi }: ApplicationState = getState();
    const resourcesUrl = `${devxApi.baseUrl}/openapi/tree`;

    const headers = {
      'Content-Type': 'application/json'
    };

    const options: IRequestOptions = { headers };

    dispatch(fetchResourcesPending());

    try {
      const cachedResources = await resourcesCache.readResources();
      if (cachedResources) {
        return dispatch(fetchResourcesSuccess(cachedResources));
      } else {
        const response = await fetch(resourcesUrl, options);
        if (response.ok) {
          const resources = await response.json() as IResource;
          resourcesCache.saveResources(resources);
          return dispatch(fetchResourcesSuccess(resources));
        }
        throw response;
      }
    } catch (error) {
      return dispatch(fetchResourcesError({ error }));
    }
  };
}