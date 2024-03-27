import { IResource, ResourcePath } from '../../../../../types/resources';
import content from '../../../../utils/resources/resources.json';
import { createResourcesList, getResourcePaths } from '../resource-explorer.utils';
import { generatePostmanCollection, generateResourcePathsFromPostmanCollection } from './postman.util';

const resource = JSON.parse(JSON.stringify(content)) as IResource;

describe('Postman collection should', () => {
  it('have items generated', async () => {
    const { collection } = setupCollection();
    expect(collection.item.length).toBeGreaterThan(0);
  });

  it('generate resource paths from postman collection', async () => {
    const { collection, paths } = setupCollection();
    const resourceLinks = generateResourcePathsFromPostmanCollection(collection);
    const resourceLinksWithoutKey = getResourcePathsWithoutKey(resourceLinks);
    const pathsWithoutKey = getResourcePathsWithoutKey(paths);
    expect(resourceLinksWithoutKey.length).toEqual(pathsWithoutKey.length);
  });

});

function setupCollection() {
  const version = 'v1.0';
  const filtered = createResourcesList(resource.children!, version)[0];
  const item: any = filtered.links[0];
  const paths = getResourcePaths(item, version);
  const collection = generatePostmanCollection(paths);
  return { collection, paths };
}

const getResourcePathsWithoutKey = (resourcePath: ResourcePath[]) => {
  return resourcePath.map(path => {
    return {
      ...path,
      key: undefined
    }
  });
}

