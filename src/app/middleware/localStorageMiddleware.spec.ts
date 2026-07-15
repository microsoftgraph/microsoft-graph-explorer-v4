import localStorageMiddleware from './localStorageMiddleware';

jest.mock('../../modules/cache/collections.cache', () => ({
  collectionsCache: {
    read: jest.fn(),
    update: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('../../modules/cache/samples.cache', () => ({
  samplesCache: {
    saveSamples: jest.fn()
  }
}));

jest.mock('../utils/local-storage', () => ({
  saveToLocalStorage: jest.fn()
}));

jest.mock('../services/reducers/collections-reducer.util', () => ({
  getUniquePaths: jest.fn((existing: any[], newPaths: any[]) => [...existing, ...newPaths])
}));

import { collectionsCache } from '../../modules/cache/collections.cache';
import { samplesCache } from '../../modules/cache/samples.cache';
import { saveToLocalStorage } from '../utils/local-storage';
import {
  CHANGE_THEME_SUCCESS, SAMPLES_FETCH_SUCCESS,
  RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS,
  COLLECTION_CREATE_SUCCESS
} from '../services/redux-constants';

describe('localStorageMiddleware', () => {
  const next = jest.fn((action) => action);
  const store = {} as any;
  const middleware = localStorageMiddleware(store)(next);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save theme to localStorage on CHANGE_THEME_SUCCESS', async () => {
    await middleware({ type: CHANGE_THEME_SUCCESS, payload: 'dark' });
    expect(saveToLocalStorage).toHaveBeenCalledWith('CURRENT_THEME', 'dark');
    expect(next).toHaveBeenCalled();
  });

  it('should save samples to cache on SAMPLES_FETCH_SUCCESS', async () => {
    const samples = [{ id: '1', humanName: 'Test' }];
    await middleware({ type: SAMPLES_FETCH_SUCCESS, payload: samples });
    expect(samplesCache.saveSamples).toHaveBeenCalledWith(samples);
    expect(next).toHaveBeenCalled();
  });

  it('should update collection paths on RESOURCEPATHS_ADD_SUCCESS', async () => {
    const mockCollection = { id: '1', isDefault: true, paths: [{ key: 'existing' }] };
    (collectionsCache.read as jest.Mock).mockResolvedValue([mockCollection]);

    const newPaths = [{ key: 'new-path' }];
    await middleware({ type: RESOURCEPATHS_ADD_SUCCESS, payload: newPaths });

    expect(collectionsCache.read).toHaveBeenCalled();
    expect(collectionsCache.update).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should delete paths from collection on RESOURCEPATHS_DELETE_SUCCESS', async () => {
    const mockCollection = { id: '1', isDefault: true, paths: [{ key: 'path1' }, { key: 'path2' }] };
    (collectionsCache.read as jest.Mock).mockResolvedValue([mockCollection]);

    await middleware({ type: RESOURCEPATHS_DELETE_SUCCESS, payload: [{ key: 'path1' }] });

    expect(collectionsCache.read).toHaveBeenCalled();
    expect(collectionsCache.update).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should create collection on COLLECTION_CREATE_SUCCESS', async () => {
    const collection = { id: '1', name: 'Test Collection' };
    await middleware({ type: COLLECTION_CREATE_SUCCESS, payload: collection });

    expect(collectionsCache.create).toHaveBeenCalledWith(collection);
    expect(next).toHaveBeenCalled();
  });

  it('should pass through unhandled actions', async () => {
    await middleware({ type: 'UNKNOWN_ACTION', payload: null });
    expect(next).toHaveBeenCalled();
    expect(saveToLocalStorage).not.toHaveBeenCalled();
    expect(samplesCache.saveSamples).not.toHaveBeenCalled();
  });
});
