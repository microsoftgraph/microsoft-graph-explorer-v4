import { ISuggestions, SignContext } from '.';
import { parseOpenApiResponse } from '../../app/utils/open-api-parser';
import {
  getResourcesSupportedByVersion
} from '../../app/utils/resources/resources-filter';
import { IOpenApiParseContent, IOpenApiResponse, IParsedOpenApiResponse } from '../../types/open-api';
import { IRequestOptions } from '../../types/request';
import { IResource } from '../../types/resources';
import { getSuggestionsFromCache, storeSuggestionsInCache } from './cache-provider';

class Suggestions implements ISuggestions {

  public async getSuggestions(url: string, api: string,
    version: string, context: SignContext, resources?: IResource): Promise<IParsedOpenApiResponse | null> {

    if (context === 'paths') {
      const resourceOptions = await this.getSuggestionsFromResources(url, version, resources!);
      if (resourceOptions) {
        return resourceOptions;
      }
    }

    const key = `${version}/${url}`;
    const localOptions = await getSuggestionsFromCache(key);
    if (localOptions) {
      return localOptions;
    }

    /*
    * blocks calls to the API for path segments
    * uses resource explorer and cache as source of truth
    */
    if (context === 'parameters') {
      return this.fetchSuggestionsFromNetwork(url, api, version);
    }

    return null;
  }

  private async getSuggestionsFromResources(url: string, version: string,
    resources: IResource): Promise<IParsedOpenApiResponse | null> {
    if (!resources || !resources.children || resources.children.length === 0) { return null; }
    const versionedResources = getResourcesSupportedByVersion(resources.children, version);
    if (!url) {
      return this.createOpenApiResponse(versionedResources, url);
    } else {
      const parts = url.split('/');
      let toSearch = [...versionedResources];
      for (const element of parts) {
        toSearch = toSearch.find(k => k.segment === element)?.children || [];
      }
      if (toSearch.length > 0) {
        return this.createOpenApiResponse(toSearch, url)
      }
    }
    return null;
  }

  private createOpenApiResponse(versionedResources: IResource[], url: string): IParsedOpenApiResponse {
    const paths: string[] = [];

    versionedResources.forEach((resource: IResource) => {
      if (!resource.segment.contains('$')) {
        paths.push(resource.segment);
      }
    });

    const response: IParsedOpenApiResponse = {
      createdAt: '',
      parameters: [{
        verb: 'get',
        values: [],
        links: paths
      }],
      url
    };

    return response;
  }

  private async fetchSuggestionsFromNetwork(
    url: string, api: string, version: string): Promise<IParsedOpenApiResponse | null> {
    const headers = {
      'Accept': 'application/json'
    };
    const openApiUrl = `${api}/openapi?url=/${url}&style=geautocomplete&graphVersion=${version}`;
    const options: IRequestOptions = { headers };
    try {
      if (hasBannedPaths()) {
        throw new Error('this call will not get good info');
      }
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

    function hasBannedPaths() {
      const banned = ['undefined', 'unknown'];
      return banned.some((char) => url.includes(char));
    }
  }
}

export const suggestions = new Suggestions();
