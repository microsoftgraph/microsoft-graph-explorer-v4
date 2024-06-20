import { AppAction } from '../../../types/action';
import {
  COLLECTION_CREATE_SUCCESS,
  RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS
} from '../redux-constants';

export function addResourcePaths(response: object): AppAction {
  return {
    type: RESOURCEPATHS_ADD_SUCCESS,
    payload: response,
    response // TODO: remove when moved to rtk is done
  };
}

export function createCollection(response: object): AppAction {
  return {
    type: COLLECTION_CREATE_SUCCESS,
    payload: response,
    response // TODO: remove
  };
}

export function removeResourcePaths(response: object): AppAction {
  return {
    type: RESOURCEPATHS_DELETE_SUCCESS,
    payload: response,
    response // TODO: remove
  };
}
