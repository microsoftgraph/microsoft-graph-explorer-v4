import localforage from 'localforage';
import { IResource } from '../../types/resources';


const resourcesStorage = localforage.createInstance({
  storeName: 'resources',
  name: 'GE_V4'
});

const RESOURCE_KEY = 'resources';

export const resourcesCache = (function () {

  const saveResources = async (queries: IResource[]) => {
    await resourcesStorage.setItem(RESOURCE_KEY, JSON.stringify(queries));
  }

  const readResources = async (): Promise<IResource[]> => {
    const items = await resourcesStorage.getItem(RESOURCE_KEY) as string;
    if (items) {
      // return JSON.parse(items);
    }
    return [];
  }

  return {
    saveResources,
    readResources
  }
})();