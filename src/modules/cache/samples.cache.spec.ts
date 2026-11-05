import { ISampleQuery } from '../../types/query-runner';
import { samplesCache } from './samples.cache';

const mockStore: Record<string, string> = {};
jest.mock('localforage', () => ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  config: () => { },
  createInstance: () => {
    return {
      getItem: (key: string) => mockStore[key] || undefined,
      setItem: (key: string, value: string) => { mockStore[key] = value; }
    };
  }
}));

const queries: ISampleQuery[] = [];
describe('Samples Cache should', () => {
  beforeEach(() => { Object.keys(mockStore).forEach(key => delete mockStore[key]); });

  it('ignores legacy data and separates custom sources from defaults', async () => {
    mockStore['sample-queries'] = JSON.stringify([{ humanName: 'Legacy' }]);
    expect(await samplesCache.readSamples()).toEqual([]);
    const a = { baseUrl: 'https://custom.example', custom: true, org: 'org', branchName: 'a' };
    const b = { ...a, branchName: 'b' };
    const customQueries: ISampleQuery[] = [{
      category: 'Tests', humanName: 'Custom', method: 'GET', requestUrl: '/v1.0/users',
      docLink: '', skipTest: false
    }];
    await samplesCache.saveSamples(customQueries, a);
    expect(await samplesCache.readSamples(a)).toEqual(customQueries);
    expect(await samplesCache.readSamples(b)).toEqual([]);
    expect(await samplesCache.readSamples()).toEqual([]);
  });

  it('return the same queries after queries added', async () => {
    expect(queries.length).toBe(0);
    queries.push(
      {
        category: 'Getting Started',
        method: 'GET',
        humanName: 'my profile',
        requestUrl: '/v1.0/me',
        docLink: 'https://learn.microsoft.com/en-us/graph/api/user-get',
        skipTest: false
      },
    );
    await samplesCache.saveSamples(queries);
    const samplesData = await samplesCache.readSamples();
    expect(samplesData).toEqual(queries);
  })
})
