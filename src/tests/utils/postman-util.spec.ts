import content from '../../app/utils/resources/resources.json';
import { generatePostmanCollection } from '../../app/views/sidebar/resource-explorer/panels/postman.util';
import {
  createResourcesList,
  getResourcePaths
} from '../../app/views/sidebar/resource-explorer/resource-explorer.utils';
import { IResource } from '../../types/resources';
const resource = JSON.parse(JSON.stringify(content)) as IResource;

describe('Postman collection should', () => {
  it('have items generated', async () => {
    const version = 'v1.0';
    const filtered = createResourcesList(resource.children, version)[0];
    const item: any = filtered.links[0];
    const paths = getResourcePaths(item, version);
    const collection = generatePostmanCollection(paths);
    expect(collection.item.length).toBe(10);
  });
});
