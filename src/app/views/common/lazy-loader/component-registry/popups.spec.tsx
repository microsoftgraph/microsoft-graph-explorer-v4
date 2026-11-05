import { popups, PopupItem } from './popups';

const REACT_LAZY_TYPE = Symbol.for('react.lazy');

describe('popups component registry', () => {
  it('should export a Map', () => {
    expect(popups).toBeInstanceOf(Map);
  });

  it('should have share-query entry', () => {
    expect(popups.has('share-query')).toBe(true);
  });

  it('should have theme-chooser entry', () => {
    expect(popups.has('theme-chooser')).toBe(true);
  });

  it('should have preview-collection entry', () => {
    expect(popups.has('preview-collection')).toBe(true);
  });

  it('should have full-permissions entry', () => {
    expect(popups.has('full-permissions')).toBe(true);
  });

  it('should have collection-permissions entry', () => {
    expect(popups.has('collection-permissions')).toBe(true);
  });

  it('should have edit-collection-panel entry', () => {
    expect(popups.has('edit-collection-panel')).toBe(true);
  });

  it('should have edit-scope-panel entry', () => {
    expect(popups.has('edit-scope-panel')).toBe(true);
  });

  it('should have custom-samples entry', () => {
    expect(popups.has('custom-samples')).toBe(true);
  });

  it('should have exactly 8 entries', () => {
    expect(popups.size).toBe(8);
  });

  it('all entries should be lazy components (functions)', () => {
    popups.forEach((value, key) => {
      expect(value).toBeDefined();
      expect(typeof value).toBe('object');
    });
  });

  it('PopupItem type should match map keys', () => {
    const keys: PopupItem[] = [
      'custom-samples',
      'share-query',
      'theme-chooser',
      'preview-collection',
      'full-permissions',
      'collection-permissions',
      'edit-collection-panel',
      'edit-scope-panel'
    ];
    keys.forEach((key) => {
      expect(popups.has(key)).toBe(true);
    });
  });

  it('each entry should be a valid React lazy component with $$typeof', () => {
    popups.forEach((value, key) => {
      expect(value).toHaveProperty('$$typeof', REACT_LAZY_TYPE);
      expect(value).toHaveProperty('_payload');
      expect(value).toHaveProperty('_init');
      expect(typeof value._init).toBe('function');
    });
  });

  it('should be iterable with for...of', () => {
    const entries: [string, any][] = [];
    for (const entry of popups) {
      entries.push(entry);
    }
    expect(entries).toHaveLength(8);
    entries.forEach(([key, value]) => {
      expect(typeof key).toBe('string');
      expect(value).toBeDefined();
    });
  });

  it('getting a non-existent key returns undefined', () => {
    expect(popups.get('non-existent-key')).toBeUndefined();
    expect(popups.get('')).toBeUndefined();
    expect(popups.get('Share-Query')).toBeUndefined();
  });

  it('map keys exactly match all PopupItem values', () => {
    const expectedKeys: PopupItem[] = [
      'custom-samples',
      'share-query',
      'theme-chooser',
      'preview-collection',
      'full-permissions',
      'collection-permissions',
      'edit-collection-panel',
      'edit-scope-panel'
    ];
    const actualKeys = Array.from(popups.keys());
    expect(actualKeys).toHaveLength(expectedKeys.length);
    expect(new Set(actualKeys)).toEqual(new Set(expectedKeys));
  });
});
