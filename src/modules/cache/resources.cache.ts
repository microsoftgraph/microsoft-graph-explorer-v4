import localforage from 'localforage';
import { IResource } from '../../types/resources';
import { ICacheData } from '../../types/sidebar';

const resourcesStorage = localforage.createInstance({
  storeName: 'resources',
  name: 'GE_V4'
});

const RESOURCE_KEY = 'resources';
const expiryTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; //1 week expiration

export const resourcesCache = (function () {

  const saveResources = async (queries: IResource[]) => {
    const cacheData={
      queries: JSON.stringify(queries),
      expiry: expiryTime
    }
    await resourcesStorage.setItem(RESOURCE_KEY, cacheData);
  }

  const readResources = async (): Promise<IResource[]> => {
    const cacheData = await resourcesStorage.getItem(RESOURCE_KEY) as ICacheData;
    if (cacheData) {
      const {queries, expiry} = cacheData;
      if(expiry >= Date.now()){
        return JSON.parse(queries);
      }
      resourcesStorage.removeItem(RESOURCE_KEY);
      return [];
    }
    return [];
  }

  return {
    saveResources,
    readResources
  }
})();