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

let resources: IResource = {
  children: [],
  labels: [],
  segment: ''
};
describe('Resources Cache should', () => {
  it('return the same resources after resources added', async () => {
    expect(resources.children.length).toBe(0);
    resources = {
      segment: '/',
      labels: [
        {
          name: 'v1.0',
          methods: [
            'Get'
          ]
        },
        {
          name: 'beta',
          methods: [
            'Get'
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
                'Get',
                'Post'
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
                    'Get',
                    'Patch',
                    'Delete'
                  ]
                }
              ],
              children: []
            }
          ]
        }
      ]
    }
    resourcesCache.saveResources(resources);
    const samplesData = await resourcesCache.readResources();
    expect(samplesData).not.toBe(resources);
  })
})
