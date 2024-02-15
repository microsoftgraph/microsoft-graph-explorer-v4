import localforage from 'localforage';
import { Collection } from '../../types/resources';

const collectionsStorage = localforage.createInstance({
  storeName: 'collections',
  name: 'GE_V4'
});

export const collectionsCache = (function () {

  const create = async (collection: Collection) => {
    await collectionsStorage.setItem(collection.id, collection);
  }

  const read = async (): Promise<Collection[]> => {
    let collections: Collection[] = [];
    const keys = await collectionsStorage.keys();
    for (const id of keys) {
      const collection = await collectionsStorage.getItem(id)! as Collection;
      collections = [...collections, collection];
    }
    return collections;
  }

  const get = async (id: string): Promise<Collection | null> => {
    const cachedCollection = await collectionsStorage.getItem(id) as Collection;
    return cachedCollection ? cachedCollection || null : null;
  }

  const update = async (id: string, collection: Collection) => {
    const cachedCollection = await collectionsStorage.getItem(id) as Collection;
    if (cachedCollection) {
      await collectionsStorage.setItem(id, collection);
    }
  }

  const destroy = async (id: string) => {
    const cachedCollection = await collectionsStorage.getItem(id) as Collection;
    if (cachedCollection) {
      await collectionsStorage.removeItem(id);
    }
  }

  return {
    create,
    get,
    read,
    update,
    destroy
  }
})();