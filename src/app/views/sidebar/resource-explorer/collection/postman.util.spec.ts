import { IResource } from '../../../../../types/resources';
import content from '../../../../utils/resources/resources.json';
import { createResourcesList, getResourcePaths } from '../resource-explorer.utils';
import { generatePostmanCollection, generateResourceLinksFromPostmanCollection } from './postman.util';

const resource = JSON.parse(JSON.stringify(content)) as IResource;

describe('Postman collection should', () => {
  it('have items generated', async () => {
    const { collection }= setupCollection();
    expect(collection.item.length).toBeGreaterThan(0);
  });

  it('generate resourcelink[] from postman collection', async () => {
    const { collection, paths } = setupCollection();
    const resourceLinks = generateResourceLinksFromPostmanCollection(collection, resource);
    expect(paths).toBe(resourceLinks);
  });
});

function setupCollection() {
  const version = 'v1.0';
  const filtered = createResourcesList(resource.children, version)[0];
  const item: any = filtered.links[0];
  const paths = getResourcePaths(item, version);
  const collection = generatePostmanCollection(paths);
  return {collection, paths};
}

