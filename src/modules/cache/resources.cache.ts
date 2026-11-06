import localforage from 'localforage';
import { IResource, IResourceLink, Version } from '../../types/resources';
import { ICacheData } from '.';
import { devxCacheKey } from '../../app/services/devx-api';
import { IDevxAPI } from '../../types/devx-api';

const resourcesStorage = localforage.createInstance({
  storeName: 'resources',
  name: 'GE_V4'
});

const RESOURCE_KEY = 'resources';
const COLLECTION_KEY = 'collection';
const expiryTime = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // 3 days expiration

export const resourcesCache = (function () {

  const saveResources = async (resource: IResource, version: Version, config?: IDevxAPI) => {
    const cacheData = {
      data: resource,
      expiry: expiryTime
    }
    await resourcesStorage.setItem(`${devxCacheKey(config)}${RESOURCE_KEY}_${version}`, cacheData);
  }

  const readResources = async (version: Version, config?: IDevxAPI): Promise<IResource | null> => {
    const key = `${devxCacheKey(config)}${RESOURCE_KEY}_${version}`;
    const cacheData = await resourcesStorage.getItem(key) as ICacheData<IResource>;
    if (cacheData) {
      const { data, expiry } = cacheData;
      if (expiry >= Date.now()) {
        return data;
      }
      resourcesStorage.removeItem(key);
    }
    return null;
  }

  const saveCollection = async (collection: IResourceLink[]) => {
    await resourcesStorage.setItem(COLLECTION_KEY, collection);
  }

  const readCollection = async (): Promise<IResourceLink[]> => {
    const cachedCollections = await resourcesStorage.getItem(COLLECTION_KEY) as IResourceLink[];
    return cachedCollections ? cachedCollections : [] as IResourceLink[];
  }

  return {
    saveResources,
    readResources,
    saveCollection,
    readCollection
  }
})();