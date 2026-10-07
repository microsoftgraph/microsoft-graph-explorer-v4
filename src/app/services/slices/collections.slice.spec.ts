import collectionsReducer, {
  createCollection,
  addResourcePaths,
  updateResourcePaths,
  removeResourcePaths,
  resetSaveState
} from './collections.slice';
import { Collection, ResourcePath, ResourceLinkType } from '../../../types/resources';

describe('collections slice', () => {
  const makePath = (key: string, name: string): ResourcePath => ({
    key,
    name,
    type: ResourceLinkType.PATH,
    url: `https://graph.microsoft.com/v1.0/${name}`,
    paths: [name]
  });

  const makeCollection = (id: string, isDefault = false, paths: ResourcePath[] = []): Collection => ({
    id,
    name: `Collection ${id}`,
    paths,
    isDefault
  });

  it('should return initial state', () => {
    const state = collectionsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({ collections: [], saved: false });
  });

  it('should create a collection', () => {
    const collection = makeCollection('1');
    const state = collectionsReducer(undefined, createCollection(collection));
    expect(state.collections).toHaveLength(1);
    expect(state.collections[0].id).toBe('1');
    expect(state.saved).toBe(false);
  });

  it('should add resource paths to default collection', () => {
    const initial = {
      collections: [makeCollection('1', true, [makePath('p1', 'users')])],
      saved: false
    };
    const newPaths = [makePath('p2', 'groups')];
    const state = collectionsReducer(initial, addResourcePaths(newPaths));
    expect(state.collections[0].paths).toHaveLength(2);
  });

  it('should not add duplicate resource paths', () => {
    const initial = {
      collections: [makeCollection('1', true, [makePath('p1', 'users')])],
      saved: false
    };
    const duplicatePaths = [makePath('p1', 'users')];
    const state = collectionsReducer(initial, addResourcePaths(duplicatePaths));
    expect(state.collections[0].paths).toHaveLength(1);
  });

  it('should do nothing if no default collection found for addResourcePaths', () => {
    const initial = {
      collections: [makeCollection('1', false)],
      saved: false
    };
    const state = collectionsReducer(initial, addResourcePaths([makePath('p1', 'users')]));
    expect(state.collections[0].paths).toHaveLength(0);
  });

  it('should update resource paths in default collection', () => {
    const initial = {
      collections: [makeCollection('1', true, [makePath('p1', 'users')])],
      saved: false
    };
    const newPaths = [makePath('p2', 'groups')];
    const state = collectionsReducer(initial, updateResourcePaths(newPaths));
    expect(state.collections[0].paths).toEqual(newPaths);
    expect(state.saved).toBe(true);
  });

  it('should remove resource paths from default collection', () => {
    const initial = {
      collections: [makeCollection('1', true, [makePath('p1', 'users'), makePath('p2', 'groups')])],
      saved: false
    };
    const state = collectionsReducer(initial, removeResourcePaths([makePath('p1', 'users')]));
    expect(state.collections[0].paths).toHaveLength(1);
    expect(state.collections[0].paths[0].key).toBe('p2');
  });

  it('should reset save state', () => {
    const initial = { collections: [], saved: true };
    const state = collectionsReducer(initial, resetSaveState());
    expect(state.saved).toBe(false);
  });
});
