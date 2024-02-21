import localforage from 'localforage';
import { IResource, IResourceLink } from '../../types/resources';
import { ICacheData } from '../../types/sidebar';

const resourcesStorage = localforage.createInstance({
  storeName: 'resources',
  name: 'GE_V4'
});

const RESOURCE_KEY = 'resources';
const COLLECTION_KEY = 'collection';
const expiryTime = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; //3 days expiration

export const resourcesCache = (function () {

  const saveResources = async (resource: IResource) => {
    const cacheData = {
      data: resource,
      expiry: expiryTime
    }
    await resourcesStorage.setItem(RESOURCE_KEY, cacheData);
  }

  const readResources = async (): Promise<IResource | null> => {
    const cacheData = await resourcesStorage.getItem(RESOURCE_KEY) as ICacheData;
    if (cacheData) {
      const { data, expiry } = cacheData;
      if (expiry >= Date.now()) {
        return data as IResource;
      }
      resourcesStorage.removeItem(RESOURCE_KEY);
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