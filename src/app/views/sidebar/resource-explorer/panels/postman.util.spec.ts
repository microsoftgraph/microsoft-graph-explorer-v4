import { IResource } from '../../../../../types/resources';
import { createResourcesList, getResourcePaths } from '../resource-explorer.utils';
import { generatePostmanCollection } from './postman.util';

const res = {
  'segment': 'sites',
  'labels': [
    {
      'name': 'v1.0',
      'methods': [
        'Get',
        'Post'
      ]
    },
    {
      'name': 'beta',
      'methods': [
        'Get',
        'Post'
      ]
    }
  ],
  'children': [
    {
      'segment': '{site-id}',
      'labels': [
        {
          'name': 'v1.0',
          'methods': [
            'Get',
            'Patch',
            'Delete'
          ]
        },
        {
          'name': 'beta',
          'methods': [
            'Get',
            'Patch',
            'Delete'
          ]
        }
      ]
    }
  ]
};
const resource = JSON.parse(JSON.stringify(res)) as IResource

describe('Postman collection should', () => {
  it('have items generated', async () => {
    const version = 'v1.0';
    const filtered = createResourcesList(resource.children, version)[0];
    const item: any = filtered.links[0];
    const paths = getResourcePaths(item, version);
    const collection = generatePostmanCollection(paths);
    expect(collection.item.length).toBeGreaterThan(0);
  });
});
