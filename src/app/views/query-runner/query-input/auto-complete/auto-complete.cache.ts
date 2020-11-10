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
    return options;
  } catch (error) {
    return null;
  }
}