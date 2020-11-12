import { parseOpenApiResponse } from '../../app/utils/open-api-parser';
import { IOpenApiParseContent, IOpenApiResponse, IParsedOpenApiResponse } from '../../types/open-api';
import { IRequestOptions } from '../../types/request';
import ISuggestions from './ISuggestions';
import { getAutoCompleteContentFromCache, storeAutoCompleteContentInCache } from './suggestions.cache';

class Suggestions implements ISuggestions {

  public async getSuggestions(url: string, api: string): Promise<IParsedOpenApiResponse | null> {
    const headers = {
      'Content-Type': 'application/json',
    };
    const openApiUrl = `${api}/openapi?url=/${url}&style=geautocomplete`;
    const options: IRequestOptions = { headers };

    // checks locally whether options for the url are already available
    // and returns them
    const localOptions = await getAutoCompleteContentFromCache(url);
    if (localOptions) {
      return getAutoCompleteContentFromCache(url);
    }

    try {
      const response = await fetch(openApiUrl, options);
      if (response.ok) {
        const openApiResponse: IOpenApiResponse = await response.json();
        const content: IOpenApiParseContent = {
          response: openApiResponse,
          url
        };
        const parsedResponse = parseOpenApiResponse(content);
        storeAutoCompleteContentInCache(parsedResponse);
        return parsedResponse;
      }
      throw new Error(response.statusText);
    } catch (error) {
      return null;
    }
  }
}

export const suggestions = new Suggestions();
