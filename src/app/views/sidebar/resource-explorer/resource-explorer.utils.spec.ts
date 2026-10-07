import { IResource } from '../../../../types/resources';
import { sanitizeQueryUrl } from '../../../utils/query-url-sanitization';
import { getMatchingResourceForUrl } from '../../../utils/resources/resources-filter';
import content from '../../../utils/resources/resources.json';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import {
  createResourcesList, generateKey, getAvailableMethods, getCurrentTree, getResourcePaths, getUrlFromLink
} from './resource-explorer.utils';

// Polyfill for String.prototype.contains used in resource-explorer.utils
if (!(String.prototype as any).contains) {
  (String.prototype as any).contains = function (searchString: string): boolean {
    return this.toLowerCase().indexOf(searchString.toLowerCase()) !== -1;
  };
}

const resource = JSON.parse(JSON.stringify(content)) as IResource
describe('Resource payload should', () => {
  it('have children', async () => {
    const resources: any = { ...resource };
    expect(resources.children.length).toBeGreaterThan(0);
  });

  it('return links with version v1.0', async () => {
    const filtered = createResourcesList(resource.children!, 'v1.0')[0];
    expect(filtered.links.length).toBeGreaterThan(0);
  });

  it('return specific tree', async () => {
    const version = 'v1.0';
    const paths = ['/', 'appCatalogs', 'teamsApps'];
    const level = 2;
    const currentTree = getCurrentTree({
      paths,
      level,
      resourceItems: resource.children!,
      version
    });
    expect(currentTree).not.toBeNull();
  });

  it('return available methods', async () => {
    const version = 'v1.0';
    const filtered = createResourcesList(resource.children!, version)[0];
    const resourceLink = filtered.links[0];
    const availableMethods = getAvailableMethods(resourceLink.labels, version);
    expect(availableMethods).not.toBeNull();
  });

  it('return a string without counters', async () => {
    const version = 'v1.0';
    const paths = ['/', 'appCatalogs', 'teamsApps'];
    const level = 3;
    const currentTree = getCurrentTree({
      paths,
      level,
      resourceItems: resource.children!,
      version
    });
    const link = currentTree;
    const withoutCounter = getUrlFromLink(link.paths);
    expect(withoutCounter).toBe('/appCatalogs/teamsApps');
  });

  it('return a flattened list of links', async () => {
    const version = 'v1.0';
    const filtered = createResourcesList(resource.children!, version)[0];
    const item: any = filtered.links[0];
    const paths = getResourcePaths(item, version);
    expect(paths.length).toBeGreaterThan(0);
  });

  it('return a valid key for a link', async () => {
    const version = 'v1.0';
    const paths = ['/', 'appCatalogs', 'teamsApps'];
    const method = 'GET';
    const key = generateKey(method, paths, version);
    expect(key).toBe('2-root-appCatalogs-teamsApps-get-v1.0');
  });
  it('return a valid key without method', () => {
    const version = 'v1.0';
    const paths = ['/', 'users'];
    const key = generateKey(undefined, paths, version);
    expect(key).toBe('1-root-users-v1.0');
  });

  it('return empty url from empty paths', () => {
    const url = getUrlFromLink([]);
    expect(url).toBe('');
  });

  it('return url from single path', () => {
    const url = getUrlFromLink(['/']);
    expect(url).toBe('/');
  });

  it('create resources list with search text', () => {
    const filtered = createResourcesList(resource.children!, 'v1.0', 'appCatalogs');
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('create resources list for beta version', () => {
    const filtered = createResourcesList(resource.children!, 'beta');
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('return empty methods for non-existing version label', () => {
    const methods = getAvailableMethods([], 'v1.0');
    expect(methods.length).toBe(0);
  });

  it('handle ResourceMethod objects in labels', () => {
    const labels = [
      {
        name: 'v1.0',
        methods: [
          { name: 'GET', documentationUrl: 'https://docs.example.com/get' },
          { name: 'POST', documentationUrl: 'https://docs.example.com/post' }
        ]
      }
    ];
    const methods = getAvailableMethods(labels as any, 'v1.0');
    expect(methods).toContain('GET');
    expect(methods).toContain('POST');
  });

  it('handle string methods in labels', () => {
    const labels = [
      { name: 'v1.0', methods: ['GET', 'DELETE'] }
    ];
    const methods = getAvailableMethods(labels as any, 'v1.0');
    expect(methods).toContain('GET');
    expect(methods).toContain('DELETE');
  });

  it('getCurrentTree throws on empty path segment', () => {
    expect(() => {
      getCurrentTree({
        paths: ['/', '', 'teamsApps'],
        level: 2,
        resourceItems: resource.children!,
        version: 'v1.0'
      });
    }).toThrow('Path segment');
  });

  it('getResourcePaths filters out NODE types', () => {
    const version = 'v1.0';
    const filtered = createResourcesList(resource.children!, version);
    if (filtered.length > 0) {
      const item = filtered[0];
      const paths = getResourcePaths(item, version);
      paths.forEach(p => {
        expect(p.type).not.toBe('NODE');
      });
    }
  });

  it('getResourcePaths adds version to elements', () => {
    const version = 'beta';
    const filtered = createResourcesList(resource.children!, version);
    if (filtered.length > 0) {
      const item = filtered[0];
      const paths = getResourcePaths(item, version);
      paths.forEach(p => {
        expect(p.version).toBe(version);
      });
    }
  });
});

describe('Resource filter should', () => {
  const resources = resource.children!;

  const messageId = 'AAMkAGFkNWI1Njg3LWZmNTUtNDZjOS04ZTM2LTc5ZTc5ZjFlNTM4ZgB1SyTR4EQuQIAbWVtP3x1LBwD4_HsJDyJ8QAAA=';

  const pairs = [
    {
      base:
        'https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/b214-e0ac-be40/appDefinitions/187117c7-af33-4b45-4d34',
      tokenised:
        'https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/{teamsApps-id}/appDefinitions/{appDefinitions-id}'
    },
    {
      base: `https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/${messageId}`,
      tokenised: 'https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/{teamsApps-id}'
    }
  ]

  pairs.forEach(pair => {
    it('return segments matching url', async () => {
      const { requestUrl } = parseSampleUrl(sanitizeQueryUrl(pair.base));
      const { requestUrl: baseUrl } = parseSampleUrl(pair.tokenised);

      const setWithId = getMatchingResourceForUrl(requestUrl, resources)!;
      const setWithPlaceholder = getMatchingResourceForUrl(baseUrl, resources)!;

      expect(setWithId.children?.length).toBe(setWithPlaceholder.children?.length);
    });

  });
});