import { getScopesFromPaths, getVersionsFromPaths, formatScopeLabel, scopeOptions } from './collection.util';
import { ResourcePath } from '../../../../../types/resources';
import { PERMS_SCOPE } from '../../../../services/graph-constants';

describe('collection.util', () => {
  describe('scopeOptions', () => {
    it('should contain all PERMS_SCOPE values', () => {
      const scopeValues = Object.values(PERMS_SCOPE);
      expect(scopeOptions.length).toBe(scopeValues.length);
      scopeOptions.forEach(option => {
        expect(scopeValues).toContain(option.key);
        expect(option.key).toBe(option.text);
      });
    });
  });

  describe('getScopesFromPaths', () => {
    it('should extract unique scopes from paths', () => {
      const paths = [
        { url: '/me', version: 'v1.0', scope: PERMS_SCOPE.WORK, method: '' },
        { url: '/users', version: 'v1.0', scope: PERMS_SCOPE.APPLICATION, method: '' },
        { url: '/groups', version: 'v1.0', scope: PERMS_SCOPE.WORK, method: '' }
      ] as any[];
      const scopes = getScopesFromPaths(paths);
      expect(scopes).toHaveLength(2);
      expect(scopes).toContain(PERMS_SCOPE.WORK);
      expect(scopes).toContain(PERMS_SCOPE.APPLICATION);
    });

    it('should use default scope when path has no scope', () => {
      const paths: ResourcePath[] = [
        { url: '/me', version: 'v1.0', methods: [] } as any
      ];
      const scopes = getScopesFromPaths(paths);
      expect(scopes).toHaveLength(1);
    });

    it('should return empty array for empty paths', () => {
      const scopes = getScopesFromPaths([]);
      expect(scopes).toHaveLength(0);
    });
  });

  describe('getVersionsFromPaths', () => {
    it('should extract unique versions from paths', () => {
      const paths: ResourcePath[] = [
        { url: '/me', version: 'v1.0', methods: [] } as any,
        { url: '/users', version: 'beta', methods: [] } as any,
        { url: '/groups', version: 'v1.0', methods: [] } as any
      ];
      const versions = getVersionsFromPaths(paths);
      expect(versions).toHaveLength(2);
      expect(versions).toContain('v1.0');
      expect(versions).toContain('beta');
    });

    it('should return empty array for empty paths', () => {
      const versions = getVersionsFromPaths([]);
      expect(versions).toHaveLength(0);
    });
  });

  describe('formatScopeLabel', () => {
    it('should format WORK scope', () => {
      expect(formatScopeLabel(PERMS_SCOPE.WORK)).toBe('Delegated Work');
    });

    it('should format APPLICATION scope', () => {
      expect(formatScopeLabel(PERMS_SCOPE.APPLICATION)).toBe('Application');
    });

    it('should format PERSONAL scope', () => {
      expect(formatScopeLabel(PERMS_SCOPE.PERSONAL)).toBe('Delegated Personal');
    });

    it('should return raw value for unknown scope', () => {
      expect(formatScopeLabel('unknown' as PERMS_SCOPE)).toBe('unknown');
    });
  });
});
