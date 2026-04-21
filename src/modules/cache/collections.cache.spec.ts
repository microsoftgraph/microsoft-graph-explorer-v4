let mockStore: Record<string, any> = {};

jest.mock('localforage', () => {
  return {
    createInstance: () => ({
      setItem: jest.fn(async (key: string, value: any) => { mockStore[key] = value; }),
      getItem: jest.fn(async (key: string) => mockStore[key] || null),
      removeItem: jest.fn(async (key: string) => { delete mockStore[key]; }),
      keys: jest.fn(async () => Object.keys(mockStore))
    })
  };
});

import { collectionsCache } from './collections.cache';

describe('collectionsCache', () => {
  beforeEach(() => {
    mockStore = {};
  });

  it('creates and reads a collection', async () => {
    const collection = { id: 'c1', name: 'Test Collection', paths: [] };
    await collectionsCache.create(collection as any);
    const result = await collectionsCache.read();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Collection');
  });

  it('gets a single collection by id', async () => {
    const collection = { id: 'c2', name: 'Second', paths: [] };
    await collectionsCache.create(collection as any);
    const result = await collectionsCache.get('c2');
    expect(result).toBeDefined();
    expect(result!.name).toBe('Second');
  });

  it('returns null for non-existent collection', async () => {
    const result = await collectionsCache.get('non-existent');
    expect(result).toBeNull();
  });

  it('updates an existing collection', async () => {
    const collection = { id: 'c3', name: 'Original', paths: [] };
    await collectionsCache.create(collection as any);
    const updated = { id: 'c3', name: 'Updated', paths: ['/me'] };
    await collectionsCache.update('c3', updated as any);
    const result = await collectionsCache.get('c3');
    expect(result!.name).toBe('Updated');
  });

  it('update does nothing for non-existent collection', async () => {
    const updated = { id: 'c-none', name: 'Updated', paths: [] };
    await collectionsCache.update('c-none', updated as any);
    const result = await collectionsCache.get('c-none');
    expect(result).toBeNull();
  });

  it('destroys an existing collection', async () => {
    const collection = { id: 'c4', name: 'ToDelete', paths: [] };
    await collectionsCache.create(collection as any);
    await collectionsCache.destroy('c4');
    const result = await collectionsCache.get('c4');
    expect(result).toBeNull();
  });

  it('destroy does nothing for non-existent collection', async () => {
    await collectionsCache.destroy('c-nonexistent');
    const result = await collectionsCache.read();
    expect(result).toEqual([]);
  });

  it('reads multiple collections', async () => {
    await collectionsCache.create({ id: 'a', name: 'A', paths: [] } as any);
    await collectionsCache.create({ id: 'b', name: 'B', paths: [] } as any);
    const result = await collectionsCache.read();
    expect(result).toHaveLength(2);
  });
});
