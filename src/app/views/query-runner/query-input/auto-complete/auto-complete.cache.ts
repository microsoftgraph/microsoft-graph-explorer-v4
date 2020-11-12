import localforage from 'localforage';
import { IParsedOpenApiResponse } from '../../../../../types/open-api';
import { stringToHash } from '../../../../utils/hash-string';

const autoCompleteStorage = localforage.createInstance({
  storeName: 'autocomplete',
  name: 'GE_V4'
});

export async function storeAutoCompleteContentInCache(content: IParsedOpenApiResponse) {
  const hashedUrl = stringToHash(content.url).toString();
  autoCompleteStorage.setItem(hashedUrl, content);
}

export async function getAutoCompleteContentFromCache(url: string): Promise<IParsedOpenApiResponse | null> {
  const hashedUrl = stringToHash(url).toString();
  try {
    const options: IParsedOpenApiResponse = await autoCompleteStorage.getItem(hashedUrl);
    if (autoCompleteOptionHasExpired(options.createdAt)) {
      autoCompleteStorage.removeItem(hashedUrl);
      return null;
    }
    return options;
  } catch (error) {
    return null;
  }
}

/**
 * Autocomplete options may be changed by the API.
 * We do not want to keep the options in the cache for too long
 * @param createdAt
 */
function autoCompleteOptionHasExpired(createdAt: string): boolean {
  const ageInDays: number = 7;
  const dateToCompare = new Date();
  dateToCompare.setDate(dateToCompare.getDate() - ageInDays);
  const expiryDate = dateToCompare.getTime();
  const createdTime = new Date(createdAt).getTime();
  return (createdTime < expiryDate);
}