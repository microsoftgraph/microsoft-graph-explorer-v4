import { AppAction } from '../../../types/action';
import {
  COLLECTION_CREATE_SUCCESS,
  RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS, RESOURCEPATHS_UPDATE_SUCCESS
} from '../redux-constants';

export function addResourcePaths(response: object): AppAction {
  return {
    type: RESOURCEPATHS_ADD_SUCCESS,
    response
  };
}

export function updateResourcePaths(response: object): AppAction {
  return {
    type: RESOURCEPATHS_UPDATE_SUCCESS,
    response
  };
}

export function createCollection(response: object): AppAction {
  return {
    type: COLLECTION_CREATE_SUCCESS,
    response
  };
}

export function removeResourcePaths(response: object): AppAction {
  return {
    type: RESOURCEPATHS_DELETE_SUCCESS,
    response
  };
}
