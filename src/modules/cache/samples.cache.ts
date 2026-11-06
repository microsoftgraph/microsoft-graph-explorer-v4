import localforage from 'localforage';
import { ISampleQuery } from '../../types/query-runner';
import { devxCacheKey } from '../../app/services/devx-api';
import { IDevxAPI } from '../../types/devx-api';

const samplesStorage = localforage.createInstance({
  storeName: 'samples',
  name: 'GE_V4'
});

const SAMPLE_KEY = 'sample-queries';

export const samplesCache = (function () {

  const saveSamples = async (queries: ISampleQuery[], config?: IDevxAPI) => {
    await samplesStorage.setItem(`${devxCacheKey(config)}${SAMPLE_KEY}`, JSON.stringify(queries));
  }

  const readSamples = async (config?: IDevxAPI): Promise<ISampleQuery[]> => {
    const items = await samplesStorage.getItem(`${devxCacheKey(config)}${SAMPLE_KEY}`) as string;
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