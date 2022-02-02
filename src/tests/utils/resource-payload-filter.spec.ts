import content from '../../app/utils/resources/resources.json';
import {
  createList, getAvailableMethods,
  getCurrentTree, getResourcePaths,
  getResourcesSupportedByVersion,
  getUrlFromLink, removeCounter
} from '../../app/views/sidebar/resource-explorer/resource-explorer.utils';
import { IResource } from '../../types/resources';
const resource = JSON.parse(JSON.stringify(content)) as IResource;

describe('Resource payload should', () => {

  it('have children', async () => {
    const resources: any = { ...content };
    expect(resources.children.length).toBeGreaterThan(0);
  });

  it('return children with version v1.0', async () => {
    const resources = getResourcesSupportedByVersion(resource, 'v1.0');
    expect(resources.children.length).toBe(64);
  });

  it('return links with version v1.0', async () => {
    const filtered = createList(resource.children, 'v1.0')[0];
    expect(filtered.links.length).toBe(64);
  });

  it('return specific tree', async () => {
    const version = 'v1.0';
    const paths = ['/', 'appCatalogs', 'teamsApps'];
    const level = 2;
    const currentTree = getCurrentTree({ paths, level, resourceItems: resource.children, version });
    expect(currentTree).not.toBeNull();
  });

  it('return available methods', async () => {
    const version = 'v1.0';
    const filtered = createList(resource.children, version)[0];
    const resourceLink = filtered.links[0];
    const availableMethods = getAvailableMethods(resourceLink.labels, version);
    expect(availableMethods).not.toBeNull();
  });

  it('return a string without counters', async () => {
    const name = 'teamsApps (1)';
    const withoutCounter = removeCounter(name);
    expect(withoutCounter).not.toBe(name);
  });

  it('return a string without counters', async () => {
    const version = 'v1.0';
    const paths = ['/', 'appCatalogs', 'teamsApps'];
    const level = 2;
    const currentTree = getCurrentTree({ paths, level, resourceItems: resource.children, version });
    const link = currentTree.links[0];
    const withoutCounter = getUrlFromLink(link);
    expect(withoutCounter).toBe('/appCatalogs/teamsApps/{teamsApp-id}');
  });

  it('return a flattened list of links', async () => {
    const version = 'v1.0';
    const filtered = createList(resource.children, version)[0];
    const item: any = filtered.links[0];
    const paths = getResourcePaths(item, version);
    expect(paths.length).toBe(10);
  });

});
