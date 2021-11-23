import content from '../../app/utils/resources/resources.json';
import {
  createList, getResourcesSupportedByVersion
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
});