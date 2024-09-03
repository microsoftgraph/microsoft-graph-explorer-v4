import { ResourcePath, ResourceLinkType } from '../../../../../types/resources';
import { isGeneratedCollectionInCollection } from './upload-collection.util';

describe('isGeneratedCollectionInCollection', () => {
  const path1: ResourcePath[] = [
    {
      paths: ['path1'],
      name: 'name1',
      type: ResourceLinkType.PATH,
      version: '1.0',
      method: 'GET',
      key: 'key1',
      url: 'http://example.com'
    },
    {
      paths: ['path2'],
      name: 'name2',
      type: ResourceLinkType.PATH,
      version: '1.1',
      method: 'POST',
      key: 'key2',
      url: 'http://example.com'
    }
  ];

  const path2: ResourcePath[] = [
    {
      paths: ['path1'],
      name: 'name1',
      type: ResourceLinkType.PATH,
      version: '1.0',
      method: 'GET',
      key: 'key1',
      url: 'http://example.com'
    },
    {
      paths: ['path2'],
      name: 'name2',
      type: ResourceLinkType.PATH,
      version: '1.1',
      method: 'POST',
      key: 'key2',
      url: 'http://example.com'
    }
  ];

  const path3: ResourcePath[] = [
    {
      paths: ['path3'],
      name: 'name3',
      type: ResourceLinkType.PATH,
      version: '1.0',
      method: 'GET',
      key: 'key3',
      url: 'http://example.com'
    }
  ];

  it('returns true when paths are equal', () => {
    expect(isGeneratedCollectionInCollection(path1, path2)).toBe(true);
  });

  it('returns false when paths are not equal', () => {
    expect(isGeneratedCollectionInCollection(path1, path3)).toBe(false);
  });
});
