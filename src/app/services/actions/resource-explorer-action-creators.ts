import { IAction } from '../../../types/action';
import { FETCH_RESOURCES_SUCCESS, FETCH_RESOURCES_PENDING, FETCH_RESOURCES_ERROR } from '../redux-constants';
import content from '../../utils/resources/resources.json';
import { IResource } from '../../../types/resources';

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
      const resources = JSON.parse(JSON.stringify(content)) as IResource;
      return dispatch(fetchResourcesSuccess(resources));
    } catch (error) {
      return dispatch(fetchResourcesError({ error }));
    }
  };
}