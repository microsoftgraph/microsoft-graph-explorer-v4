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
        fetch(resourcesUrl, options)
          .then(response => {
            if (!response.ok) {
              throw response;
            }
            const reader = response.body!.getReader();
            return new ReadableStream({
              start(controller) {
                function push() {
                  reader.read().then(({ done, value }) => {
                    if (done) {
                      controller.close();
                      return;
                    }
                    controller.enqueue(value);
                    push();
                  })
                    .catch(error => {
                      controller.error(error);
                    });
                };
                push();
              }
            });
          })
          .then(stream => {
            return new Response(stream, { headers: { 'Content-Type': 'application/json' } }).json();
          })
          .then((resources: IResource) => {
            resourcesCache.saveResources(resources);
            return dispatch(fetchResourcesSuccess(resources));
          });
      }
    } catch (error) {
      return dispatch(fetchResourcesError({ error }));
    }
  };
}