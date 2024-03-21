import { IResource } from '../../types/resources';
import { resourcesCache } from './resources.cache';
jest.mock('localforage', () => ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  config: () => { },
  createInstance: () => ({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getItem: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setItem: () => { }
  })
}));

const emptyResource: IResource = {
  segment: '',
  labels: [],
  children: []
}

const resources: IResource = {
  segment: '/',
  labels: [
    {
      name: 'v1.0',
      methods: [
        'GET'
      ]
    },
    {
      name: 'beta',
      methods: [
        'GET'
      ]
    }
  ],
  children: [
    {
      segment: 'accessReviewDecisions',
      labels: [
        {
          name: 'beta',
          methods: [
            'GET',
            'POST'
          ]
        }
      ],
      children: [
        {
          segment: '{accessReviewDecision-id}',
          labels: [
            {
              name: 'beta',
              methods: [
                'GET',
                'PATCH',
                'DELETE'
              ]
            }
          ],
          children: []
        }
      ]
    }
  ]
};

beforeEach(async () => {
  // Save resource in the cache
  await resourcesCache.saveResources(resources, 'beta');
});

afterEach(async () => {
  // Clear the cache
  await resourcesCache.saveResources(emptyResource, 'beta');
});

describe('Resources Cache should', () => {

  it('update the cache after 3 days', async () => {
    // Moving the clock forward by 3 days
    const currentTime = new Date().getTime();
    jest.spyOn(Date, 'now').mockImplementation(() => currentTime + 3 * 24 * 60 * 60 * 1000);

    // Fetch the resource and check that it's updated
    const updatedResource = await resourcesCache.readResources('beta');

    expect(updatedResource).toEqual(null);
  });
});


