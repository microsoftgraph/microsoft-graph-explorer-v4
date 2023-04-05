import { IResource } from '../../../../types/resources';
import { getResourcesSupportedByVersion } from '../../../utils/resources/resources-filter';
import {
  createResourcesList, getAvailableMethods, getCurrentTree, getResourcePaths, getUrlFromLink, removeCounter
} from './resource-explorer.utils';
import content from './resources.json'

const resource = JSON.parse(JSON.stringify(content)) as IResource
describe('Resource payload should', () => {
  it('have children', async () => {
    const resources: any = { ...resource };
    expect(resources.children.length).toBeGreaterThan(0);
  });

  it('return children with version v1.0', async () => {
    const resources = getResourcesSupportedByVersion(resource.children, 'v1.0');
    expect(resources.length).toBeGreaterThan(0);
  });

  it('return links with version v1.0', async () => {
    const filtered = createResourcesList(resource.children, 'v1.0')[0];
    expect(filtered.links.length).toBeGreaterThan(0);
  });

  it('return specific tree', async () => {
    const version = 'v1.0';
    const paths = ['/', 'appCatalogs', 'teamsApps'];
    const level = 2;
    const currentTree = getCurrentTree({
      paths,
      level,
      resourceItems: resource.children,
      version
    });
    expect(currentTree).not.toBeNull();
  });

  it('return available methods', async () => {
    const version = 'v1.0';
    const filtered = createResourcesList(resource.children, version)[0];
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
    const level = 3 ;
    const currentTree = getCurrentTree({
      paths,
      level,
      resourceItems: resource.children,
      version
    });
    const link = currentTree.links[0];
    const withoutCounter = getUrlFromLink(link);
    expect(withoutCounter).toBe('/appCatalogs/teamsApps');
  });

  it('return a flattened list of links', async () => {
    const version = 'v1.0';
    const filtered = createResourcesList(resource.children, version)[0];
    const item: any = filtered.links[0];
    const paths = getResourcePaths(item, version);
    expect(paths.length).toBeGreaterThan(0);
  });
});
