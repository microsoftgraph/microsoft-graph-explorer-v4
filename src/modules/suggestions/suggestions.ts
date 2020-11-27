import { parseOpenApiResponse } from '../../app/utils/open-api-parser';
import { IOpenApiParseContent, IOpenApiResponse, IParsedOpenApiResponse } from '../../types/open-api';
import { IRequestOptions } from '../../types/request';
import { getSuggestionsFromCache, storeSuggestionsInCache } from './cache-provider';
import ISuggestions from './ISuggestions';

class Suggestions implements ISuggestions {

  public async getSuggestions(url: string, api: string, version: string): Promise<IParsedOpenApiResponse | null> {
    // checks locally whether options for the url are already available
    // and returns them
    const key = `${version}/${url}`;
    const localOptions = await getSuggestionsFromCache(key);
    if (localOptions) {
      return getSuggestionsFromCache(key);
    }

    return this.fetchSuggestionsFromNetwork(url, api, version);
  }

  private async fetchSuggestionsFromNetwork(url: string, api: string, version: string):
    Promise<IParsedOpenApiResponse | null> {
    const headers = {
      'Content-Type': 'application/json',
    };
    const openApiUrl = `${api}/openapi?url=/${url}&style=geautocomplete&graphVersion=${version}`;
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
        storeSuggestionsInCache(parsedResponse, version);
        return parsedResponse;
      }
      throw new Error(response.statusText);
    } catch (error) {
      return null;
    }
  }
}

export const suggestions = new Suggestions();
