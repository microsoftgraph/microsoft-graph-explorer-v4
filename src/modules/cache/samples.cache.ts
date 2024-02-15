import localforage from 'localforage';
import { ISampleQuery } from '../../types/query-runner';

const samplesStorage = localforage.createInstance({
  storeName: 'samples',
  name: 'GE_V4'
});

const SAMPLE_KEY = 'sample-queries';

export const samplesCache = (function () {

  const saveSamples = async (queries: ISampleQuery[]) => {
    await samplesStorage.setItem(SAMPLE_KEY, JSON.stringify(queries));
  }

  const readSamples = async (): Promise<ISampleQuery[]> => {
    const items = await samplesStorage.getItem(SAMPLE_KEY) as string;
    if (items) {
      return JSON.parse(items);
    }
    return [];
  }

  return {
    saveSamples,
    readSamples
  }
})();