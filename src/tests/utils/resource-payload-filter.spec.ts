import { filterResourcesByLabel } from '../../app/utils/resources/resource-payload-filter';
import content from '../../app/utils/resources/resources.json';

describe('Resource payload should', () => {
  it('have children', async () => {
    const resources: any = { ...content };
    expect(resources.children.length).toBeGreaterThan(0);
  });

  it('return children with selected version', async () => {
    const filters = ['v1.0'];
    const resources = filterResourcesByLabel(content, filters);
    expect(resources.children.length).toBe(83);
  });

  it('return children with selected clouds', async () => {
    const filters = ['Prod'];
    const resources = filterResourcesByLabel(content, filters);
    expect(resources.children.length).toBe(127);
  });
});