import localforage from 'localforage';
import { IResource } from '../../types/resources';


const resourcesStorage = localforage.createInstance({
  storeName: 'resources',
  name: 'GE_V4'
});

const RESOURCE_KEY = 'resources';
const expiryTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; //1 week expiration

export const resourcesCache = (function () {

  const saveResources = async (queries: IResource[]) => {
    const cacheData={
      data: JSON.stringify(queries),
      expiry: expiryTime
    }
    await resourcesStorage.setItem(RESOURCE_KEY, cacheData);
  }

  const readResources = async (): Promise<IResource[]> => {
    const cacheData = await resourcesStorage.getItem(RESOURCE_KEY) as any;
    if (cacheData) {
      const {data, expiry} = cacheData;
      if(expiry < Date.now()){
        resourcesStorage.removeItem(RESOURCE_KEY);
        return[]
      }
      return  JSON.parse(data);
    }
    return [] ;
  }

  return {
    saveResources,
    readResources
  }
})();