import { IResource } from '../../../../../types/resources';
import { createResourcesList, getResourcePaths } from '../resource-explorer.utils';
import { generatePostmanCollection } from './postman.util';

const resource: IResource = {
  'segment': '/',
  'labels': [
    {
      'name': 'v1.0',
      'methods': [
        'Get'
      ]
    },
    {
      'name': 'beta',
      'methods': [
        'Get'
      ]
    }
  ],
  'children': [
    {
      'segment': 'accessReviewDecisions',
      'labels': [
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
          'segment': '{accessReviewDecision-id}',
          'labels': [
            {
              'name': 'beta',
              'methods': [
                'Get',
                'Patch',
                'Delete'
              ]
            }
          ],
          'children': []
        }
      ]
    }
  ]
};

describe('Postman collection should', () => {
  it('have items generated', async () => {
    const version = 'v1.0';
    const filtered = createResourcesList(resource.children, version)[0];
    const item: any = filtered.links[0];
    const paths = getResourcePaths(item, version);
    const collection = generatePostmanCollection(paths);
    expect(collection.item.length).toBe(33);
  });
});
