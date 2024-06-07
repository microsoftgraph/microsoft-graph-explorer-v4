import { Dispatch, Middleware, UnknownAction } from '@reduxjs/toolkit';
import { collectionsCache } from '../../modules/cache/collections.cache';
import { samplesCache } from '../../modules/cache/samples.cache';
import { AppAction } from '../../types/action';
import { ResourcePath } from '../../types/resources';
import { CURRENT_THEME } from '../services/graph-constants';
import { getUniquePaths } from '../services/reducers/collections-reducer.util';
import {
  CHANGE_THEME_SUCCESS, COLLECTION_CREATE_SUCCESS,
  RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS, SAMPLES_FETCH_SUCCESS
} from '../services/redux-constants';
import { saveToLocalStorage } from '../utils/local-storage';

const localStorageMiddleware: Middleware<{}, any, Dispatch<UnknownAction>> = () => (next) => async (value) => {
  const action = value as AppAction;
  switch (action.type) {
    case CHANGE_THEME_SUCCESS:
      saveToLocalStorage(CURRENT_THEME, action.response);
      break;

    case SAMPLES_FETCH_SUCCESS:
      samplesCache.saveSamples(action.response);
      break;

    case RESOURCEPATHS_ADD_SUCCESS: {
      const collections = await collectionsCache.read();
      const item = collections.find(k => k.isDefault)!;
      item.paths = getUniquePaths(item.paths, action.response);
      await collectionsCache.update(item.id, item);
      break;
    }

    case RESOURCEPATHS_DELETE_SUCCESS: {
      const paths = action.response;
      const collections = await collectionsCache.read();
      const collection = collections.find(k => k.isDefault)!;
      paths.forEach((path: ResourcePath) => {
        const index = collection.paths.findIndex(k => k.key === path.key);
        if (index > -1) {
          collection.paths.splice(index, 1);
        }
      })
      await collectionsCache.update(collection.id, collection);
      break;
    }

    case COLLECTION_CREATE_SUCCESS: {
      await collectionsCache.create(action.response);
      break;
    }

    default:
      break;
  }
  return next(action);
}


export default localStorageMiddleware;
