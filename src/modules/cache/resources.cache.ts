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

  const saveResources = async (resource: IResource) => {
    const cacheData={
      data: JSON.stringify(resource),
      expiry: expiryTime
    }
    await resourcesStorage.setItem(RESOURCE_KEY, cacheData);
  }

  const readResources = async (): Promise<IResource | null> => {
    const cacheData = await resourcesStorage.getItem(RESOURCE_KEY) as ICacheData;
    if (cacheData) {
      const {data, expiry} = cacheData;
      if(expiry >= Date.now()){
        return JSON.parse(data);
      }
      resourcesStorage.removeItem(RESOURCE_KEY);
    }
    return null;
  }

  return {
    saveResources,
    readResources
  }
})();