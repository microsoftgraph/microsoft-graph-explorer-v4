import { filterResourcesByLabel } from '../../app/utils/resources/resource-payload-filter';
import content from '../../app/utils/resources/resources.json';
import { IResource } from '../../types/resources';
const resource = JSON.parse(JSON.stringify(content)) as IResource;

describe('Resource payload should', () => {
  it('have children', async () => {
    const resources: any = { ...content };
    expect(resources.children.length).toBeGreaterThan(0);
  });

  it('return children with selected version', async () => {
    const filters = ['v1.0'];
    const resources = filterResourcesByLabel(resource, filters);
    expect(resources.children.length).toBe(83);
  });

  it('return children with selected clouds', async () => {
    const filters = ['Prod'];
    const resources = filterResourcesByLabel(resource, filters);
    expect(resources.children.length).toBe(127);
  });
});