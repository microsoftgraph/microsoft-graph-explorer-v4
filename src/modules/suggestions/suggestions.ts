import { parseOpenApiResponse } from '../../app/utils/open-api-parser';
import { IOpenApiParseContent, IOpenApiResponse, IParsedOpenApiResponse } from '../../types/open-api';
import { IRequestOptions } from '../../types/request';
import { getSuggestionsFromCache, storeSuggestionsInCache } from './cache-provider';
import ISuggestions from './ISuggestions';

class Suggestions implements ISuggestions {

  public async getSuggestions(url: string, api: string): Promise<IParsedOpenApiResponse | null> {
    // checks locally whether options for the url are already available
    // and returns them
    const localOptions = await getSuggestionsFromCache(url);
    if (localOptions) {
      return getSuggestionsFromCache(url);
    }

    return this.fetchSuggestionsFromNetwork(url, api);
  }

  private async fetchSuggestionsFromNetwork(url: string, api: string): Promise<IParsedOpenApiResponse | null> {
    const headers = {
      'Content-Type': 'application/json',
    };
    const openApiUrl = `${api}/openapi?url=/${url}&style=geautocomplete`;
    const options: IRequestOptions = { headers };

    try {
      const response = await fetch(openApiUrl, options);
      if (response.ok) {
        const openApiResponse: IOpenApiResponse = await response.json();
        const content: IOpenApiParseContent = {
          response: openApiResponse,
          url
        };
        const parsedResponse = parseOpenApiResponse(content);
        storeSuggestionsInCache(parsedResponse);
        return parsedResponse;
      }
      throw new Error(response.statusText);
    } catch (error) {
      return null;
    }
  }
}

export const suggestions = new Suggestions();
