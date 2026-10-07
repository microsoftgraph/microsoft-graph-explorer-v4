import { IResource, IResourceLink } from '../../types/resources';
import { resourcesCache } from './resources.cache';

const mockStore: Record<string, any> = {};

jest.mock('localforage', () => ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  config: () => { },
  createInstance: () => ({
    getItem: jest.fn((key: string) => Promise.resolve(mockStore[key] ?? null)),
    setItem: jest.fn((key: string, value: any) => {
      mockStore[key] = value;
      return Promise.resolve(value);
    }),
    removeItem: jest.fn((key: string) => {
      delete mockStore[key];
      return Promise.resolve();
    })
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
  // Clear mock store
  Object.keys(mockStore).forEach(key => delete mockStore[key]);
  // Save resource in the cache
  await resourcesCache.saveResources(resources, 'beta');
});

afterEach(async () => {
  Object.keys(mockStore).forEach(key => delete mockStore[key]);
});

describe('Resources Cache should', () => {

  it('update the cache after 3 days', async () => {
    // Moving the clock forward by 3 days
    const currentTime = new Date().getTime();
    jest.spyOn(Date, 'now').mockImplementation(() => currentTime + 3 * 24 * 60 * 60 * 1000);

    // Fetch the resource and check that it's updated
    const updatedResource = await resourcesCache.readResources('beta');

    expect(updatedResource).toEqual(null);
    jest.restoreAllMocks();
  });

  it('save and read resources within expiry', async () => {
    await resourcesCache.saveResources(resources, 'v1.0');
    // Read within expiry (Date.now returns current time which is before expiry)
    const result = await resourcesCache.readResources('v1.0');
    expect(result).toEqual(resources);
  });

  it('return null when no cached resource exists', async () => {
    const result = await resourcesCache.readResources('v1.0');
    expect(result).toBeNull();
  });

  it('save and read collection', async () => {
    const collection: IResourceLink[] = [
      {
        key: 'test-key',
        url: '/users',
        name: 'users',
        labels: [],
        isExpanded: false,
        parent: '',
        level: 0,
        paths: ['/', 'users'],
        type: 'PATH' as any,
        links: [],
        method: 'GET'
      }
    ];
    await resourcesCache.saveCollection(collection);
    const result = await resourcesCache.readCollection();
    expect(result).toEqual(collection);
  });

  it('return empty array when no collection is cached', async () => {
    const result = await resourcesCache.readCollection();
    expect(result).toEqual([]);
  });
});


