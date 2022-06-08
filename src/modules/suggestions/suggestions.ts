import { ISuggestions, SignContext } from '.';
import { parseOpenApiResponse } from '../../app/utils/open-api-parser';
import { IOpenApiParseContent, IOpenApiResponse, IParsedOpenApiResponse } from '../../types/open-api';
import { IRequestOptions } from '../../types/request';
import { getSuggestionsFromCache, storeSuggestionsInCache } from './cache-provider';

class Suggestions implements ISuggestions {

  public async getSuggestions(url: string, api: string,
    version: string, context: SignContext): Promise<IParsedOpenApiResponse | null> {

    if (context === 'paths') {
      const resourceOptions = await this.getSuggestionsFromResources(url, version);
      if (resourceOptions) {
        return resourceOptions;
      }
    }

    // checks locally whether options for the url are already available
    // and returns them
    const key = `${version}/${url}`;
    const localOptions = await getSuggestionsFromCache(key);
    if (localOptions) {
      return localOptions;
    }

    return this.fetchSuggestionsFromNetwork(url, api, version);
  }

  private async getSuggestionsFromResources(_url: string, _version: string): Promise<IParsedOpenApiResponse | null> {
    return null;
  }

  private async fetchSuggestionsFromNetwork(
    url: string, api: string, version: string): Promise<IParsedOpenApiResponse | null> {
    const headers = {
      'Accept': 'application/json'
    };
    const openApiUrl = `${api}/openapi?url=/${url}&style=geautocomplete&graphVersion=${version}`;
    const options: IRequestOptions = { headers };
    console.log({ openApiUrl })
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
