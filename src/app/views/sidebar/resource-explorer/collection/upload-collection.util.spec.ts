import { ResourceLinkType, ResourcePath } from '../../../../../types/resources';
import { isGeneratedCollectionInCollection, trackUploadAction } from './upload-collection.util';

jest.mock('../../../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn() },
  eventTypes: { BUTTON_CLICK_EVENT: 'btn' },
  componentNames: { UPLOAD_COLLECTIONS_BUTTON: 'upload-btn' }
}));

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

  it('returns true when larger set contains smaller set', () => {
    expect(isGeneratedCollectionInCollection(path3, path1)).toBe(false);
    expect(isGeneratedCollectionInCollection(path1, [...path1, ...path3])).toBe(true);
  });

  it('returns false when optional properties differ', () => {
    const pathA: ResourcePath[] = [{
      paths: ['p1'], name: 'n1', type: ResourceLinkType.PATH,
      version: '1.0', method: 'GET', key: 'k1', url: 'http://example.com'
    }];
    const pathB: ResourcePath[] = [{
      paths: ['p1'], name: 'n1', type: ResourceLinkType.PATH,
      version: '2.0', method: 'GET', key: 'k1', url: 'http://example.com'
    }];
    expect(isGeneratedCollectionInCollection(pathA, pathB)).toBe(false);
  });
});

describe('trackUploadAction', () => {
  it('calls telemetry.trackEvent with correct params', () => {
    const { telemetry } = require('../../../../../telemetry');
    trackUploadAction('success');
    expect(telemetry.trackEvent).toHaveBeenCalledWith('btn', {
      componentName: 'upload-btn',
      status: 'success'
    });
  });
});
