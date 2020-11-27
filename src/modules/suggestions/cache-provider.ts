import localforage from 'localforage';
import { stringToHash } from '../../app/utils/hash-string';
import { IParsedOpenApiResponse } from '../../types/open-api';

const suggestionsStorage = localforage.createInstance({
  storeName: 'autocomplete',
  name: 'GE_V4'
});

export async function storeSuggestionsInCache(content: IParsedOpenApiResponse, version: string) {
  const key = `${version}/${content.url}`;
  const hashedUrl = stringToHash(key).toString();
  suggestionsStorage.setItem(hashedUrl, content);
}

export async function getSuggestionsFromCache(url: string): Promise<IParsedOpenApiResponse | null> {
  const hashedUrl = stringToHash(url).toString();
  console.log({ hashedUrl });
  try {
    const options: IParsedOpenApiResponse = await suggestionsStorage.getItem(hashedUrl);
    if (suggestionHasExpired(options.createdAt)) {
      suggestionsStorage.removeItem(hashedUrl);
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
function suggestionHasExpired(createdAt: string): boolean {
  const ageInDays: number = 7;
  const dateToCompare = new Date();
  dateToCompare.setDate(dateToCompare.getDate() - ageInDays);
  const expiryDate = dateToCompare.getTime();
  const createdTime = new Date(createdAt).getTime();
  return (createdTime < expiryDate);
}