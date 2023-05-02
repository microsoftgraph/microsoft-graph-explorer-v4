import { collectionsCache } from '../../modules/cache/collections.cache';
import { resourcesCache } from '../../modules/cache/resources.cache';
import { samplesCache } from '../../modules/cache/samples.cache';
import { saveTheme } from '../../themes/theme-utils';
import { AppAction } from '../../types/action';
import { IResourceLink } from '../../types/resources';
import { addResourcePaths } from '../services/actions/resource-explorer-action-creators';
import {
  CHANGE_THEME_SUCCESS, COLLECTION_CREATE_SUCCESS, FETCH_RESOURCES_ERROR, FETCH_RESOURCES_SUCCESS,
  RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS, SAMPLES_FETCH_SUCCESS
} from '../services/redux-constants';

const localStorageMiddleware = (store: any) => (next: any) => async (action: AppAction) => {
  switch (action.type) {
    case CHANGE_THEME_SUCCESS:
      saveTheme(action.response);
      break;

    case SAMPLES_FETCH_SUCCESS:
      samplesCache.saveSamples(action.response);
      break;

    case RESOURCEPATHS_ADD_SUCCESS: {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry && navigationEntry.loadEventEnd > 0) {
        await saveResourcesCollection(action.response);
      }
      break;
    }
    case RESOURCEPATHS_DELETE_SUCCESS: {
      updateResourcesCollection(action.response)
      break;
    }
    case COLLECTION_CREATE_SUCCESS: {
      collectionsCache.create(action.response);
      break;
    }

    case FETCH_RESOURCES_SUCCESS:
    case FETCH_RESOURCES_ERROR: {
      resourcesCache.readCollection().then((data: IResourceLink[]) => {
        if (data && data.length > 0) {
          store.dispatch(addResourcePaths(data));
        }
      });
      break;
    }

    default:
      break;
  }
  return next(action);
};

async function saveResourcesCollection(paths: IResourceLink[]) {
  const cachedCollection = await resourcesCache.readCollection();
  let newPaths: IResourceLink[] = paths;
  if (cachedCollection && cachedCollection.length > 0) {
    newPaths = [...cachedCollection, ...paths]
  }
  await resourcesCache.saveCollection(newPaths);

  const collections = await collectionsCache.read();
  if (collections && collections.length > 0) {
    const item = collections[0];
    item.paths = newPaths;
    await collectionsCache.update(item.id, item);
  }
}

async function updateResourcesCollection(paths: IResourceLink[]) {
  const cachedCollection = await resourcesCache.readCollection();
  if (cachedCollection && cachedCollection.length > 0) {
    paths.forEach((path: IResourceLink) => {
      const index = cachedCollection.findIndex(k => k.key === path.key);
      if (index > -1) {
        cachedCollection.splice(index, 1);
      }
    })
    await resourcesCache.saveCollection(cachedCollection);
  }

  const collections = await collectionsCache.read();
  if (collections && collections.length > 0) {
    const collection = collections[0];
    paths.forEach((path: IResourceLink) => {
      const index = collection.paths.findIndex(k => k.key === path.key);
      if (index > -1) {
        collection.paths.splice(index, 1);
      }
    })
    await collectionsCache.update(collection.id, collection);
  }
}

export default localStorageMiddleware;
