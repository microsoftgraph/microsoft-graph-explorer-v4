import { searchResources, getMatchingResourceForUrl } from './resources-filter';
import { IResource } from '../../../types/resources';

jest.mock('../sample-url-generation', () => ({
  hasPlaceHolders: (s: string) => s.includes('{') && s.includes('}')
}));

// Polyfill String.prototype.contains used by the source code
beforeAll(() => {
  if (!(String.prototype as any).contains) {
    (String.prototype as any).contains = String.prototype.includes;
  }
});

describe('resources-filter', () => {
  const resources: IResource[] = [
    {
      segment: 'users',
      labels: [],
      children: [
        {
          segment: '{user-id}',
          labels: [],
          children: [
            { segment: 'messages', labels: [], children: [] },
            { segment: 'contacts', labels: [], children: [] }
          ]
        }
      ]
    },
    {
      segment: 'groups',
      labels: [],
      children: [
        { segment: '{group-id}', labels: [], children: [] }
      ]
    },
    {
      segment: 'me',
      labels: [],
      children: [
        { segment: 'drive', labels: [], children: [] }
      ]
    }
  ];

  describe('searchResources', () => {
    it('should find resources matching segment', () => {
      const results = searchResources(resources, 'users');
      expect(results).toHaveLength(1);
      expect(results[0].segment).toBe('users');
    });

    it('should find nested resources', () => {
      const results = searchResources(resources, 'messages');
      expect(results).toHaveLength(1);
      expect(results[0].segment).toBe('users');
      expect(results[0].children).toHaveLength(1);
    });

    it('should return empty for no matches', () => {
      const results = searchResources(resources, 'nonexistent');
      expect(results).toHaveLength(0);
    });

    it('should find multiple matches', () => {
      const results = searchResources(resources, 'group');
      expect(results.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getMatchingResourceForUrl', () => {
    it('should match exact segments', () => {
      const result = getMatchingResourceForUrl('users', resources);
      expect(result?.segment).toBe('users');
    });

    it('should match nested paths', () => {
      const result = getMatchingResourceForUrl('me/drive', resources);
      expect(result?.segment).toBe('drive');
    });

    it('should match placeholder segments', () => {
      const result = getMatchingResourceForUrl('users/{user-id}/messages', resources);
      expect(result?.segment).toBe('messages');
    });

    it('should return undefined for non-matching paths', () => {
      const result = getMatchingResourceForUrl('nonexistent/path', resources);
      expect(result).toBeUndefined();
    });

    it('should handle empty URL', () => {
      const result = getMatchingResourceForUrl('', resources);
      expect(result).toBeUndefined();
    });

    it('should handle paths with leading slash', () => {
      const result = getMatchingResourceForUrl('/users', resources);
      expect(result?.segment).toBe('users');
    });

    it('should handle paths with trailing slash', () => {
      const result = getMatchingResourceForUrl('me/drive/', resources);
      expect(result?.segment).toBe('drive');
    });

    it('should return undefined for empty resources array', () => {
      const result = getMatchingResourceForUrl('users', []);
      expect(result).toBeUndefined();
    });
  });
});
