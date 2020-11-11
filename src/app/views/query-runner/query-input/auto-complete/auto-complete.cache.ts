import localforage from 'localforage';
import { IParsedOpenApiResponse } from '../../../../../types/open-api';

const autoCompleteStorage = localforage.createInstance({
  storeName: 'autocomplete',
  name: 'GE_V4'
});

export async function storeAutoCompleteContentInCache(content: IParsedOpenApiResponse) {
  autoCompleteStorage.setItem(content.url, content);
}

export async function getAutoCompleteContentFromCache(url: string) {
  try {
    const options: IParsedOpenApiResponse = await autoCompleteStorage.getItem(url);
    if (autoCompleteOptionHasExpired(options.createdAt)) {
      autoCompleteStorage.removeItem(url);
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