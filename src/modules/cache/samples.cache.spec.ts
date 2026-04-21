import { ISampleQuery } from '../../types/query-runner';
import { samplesCache } from './samples.cache';

jest.mock('localforage', () => ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  config: () => { },
  createInstance: () => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || undefined,
      setItem: (key: string, value: string) => { store[key] = value; }
    };
  }
}));

const queries: ISampleQuery[] = [];
describe('Samples Cache should', () => {
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
    samplesCache.saveSamples(queries);
    const samplesData = await samplesCache.readSamples();
    expect(samplesData).not.toBe(queries);
  })
})
