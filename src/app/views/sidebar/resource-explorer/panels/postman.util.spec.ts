import { IResource } from '../../../../../types/resources';
import content from '../../../../utils/resources/resources.json';
import { createResourcesList, getResourcePaths } from '../resource-explorer.utils';
import { generatePostmanCollection } from './postman.util';

const resource = JSON.parse(JSON.stringify(content)) as IResource;

describe('Postman collection should', () => {
  it('have items generated', async () => {
    const version = 'v1.0';
    const filtered = createResourcesList(resource.children, version)[0];
    const item: any = filtered.links[0];
    const paths = getResourcePaths(item, version);
    const collection = generatePostmanCollection(paths);
    const folderItems: any = collection.item[0];
    expect(folderItems.item.length).toBe(33);
  });
});
