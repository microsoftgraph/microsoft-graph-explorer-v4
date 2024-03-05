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
    const v1Url = resourcesUrl + '?graphVersions=v1.0';
    const betaUrl = resourcesUrl + '?graphVersions=beta';

    const headers = {
      'Content-Type': 'application/json'
    };

    const options: IRequestOptions = { headers };

    dispatch(fetchResourcesPending());

    try {
      const v1CachedResources = await resourcesCache.readResources('v1.0');
      const betaCachedResources = await resourcesCache.readResources('beta');
      if (v1CachedResources && betaCachedResources) {
        return dispatch(fetchResourcesSuccess({
          'v1.0': v1CachedResources,
          'beta': betaCachedResources
        }));
      } else {
        const [v1Response, betaResponse] = await Promise.all([
          fetch(v1Url, options),
          fetch(betaUrl, options)
        ]);

        if (v1Response.ok && betaResponse.ok) {
          const [v1Data, betaData] = await Promise.all([
            v1Response.json(), betaResponse.json()
          ]);

          resourcesCache.saveResources(v1Data as IResource, 'v1.0');
          resourcesCache.saveResources(betaData as IResource, 'beta');

          return dispatch(fetchResourcesSuccess({
            'v1.0': v1Data,
            'beta': betaData
          }));
        } else {
          throw new Error('Failed to fetch resources');
        }
      }
    } catch (error) {
      return dispatch(fetchResourcesError({ error }));
    }
  };
}