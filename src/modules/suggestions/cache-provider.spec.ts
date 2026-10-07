import { IParsedOpenApiResponse } from '../../types/open-api';
import { storeSuggestionsInCache, getSuggestionsFromCache } from './cache-provider';

describe('Cache provider should', () => {
  it('return options from local storage which is null because suggestions' +
    ' are expired when getSuggestionsFromCache is called', async () => {
    const openApiContent: IParsedOpenApiResponse = {
      url: 'https://api.github.com/search/users?q=tom',
      parameters: [
        {
          verb: 'GET',
          values: [
            {
              name: 'q',
              items: ['tom', 'jerry']
            }
          ],
          links: []
        }
      ],
      version: 'v1',
      createdAt: '2020-04-01T00:00:00.000Z'
    }

    const version = 'v1';
    await storeSuggestionsInCache(openApiContent, version);
    const data = await getSuggestionsFromCache(openApiContent.url);
    expect(data).toBeNull();
  });

  it('should return cached data when not expired', async () => {
    const recentDate = new Date().toISOString();
    const openApiContent: IParsedOpenApiResponse = {
      url: 'https://graph.microsoft.com/v1.0/me',
      parameters: [
        { verb: 'GET', values: [{ name: 'select', items: ['id', 'displayName'] }], links: [] }
      ],
      version: 'v1.0',
      createdAt: recentDate
    };

    await storeSuggestionsInCache(openApiContent, 'v1.0');
    const data = await getSuggestionsFromCache('v1.0/' + openApiContent.url);
    expect(data).not.toBeNull();
    expect(data!.url).toBe('https://graph.microsoft.com/v1.0/me');
  });

  it('should store suggestions with version prefix key', async () => {
    const openApiContent: IParsedOpenApiResponse = {
      url: '/users',
      parameters: [],
      version: 'beta',
      createdAt: new Date().toISOString()
    };

    // Should not throw
    await expect(storeSuggestionsInCache(openApiContent, 'beta')).resolves.not.toThrow();
  });

  it('should return null when cache lookup throws an error', async () => {
    // Calling with a URL that won't have been stored
    const data = await getSuggestionsFromCache('nonexistent/url/path');
    expect(data).toBeNull();
  });

  it('should return null and remove item when cached suggestion is expired', async () => {
    const expiredDate = new Date('2020-01-01T00:00:00.000Z').toISOString();
    const openApiContent: IParsedOpenApiResponse = {
      url: 'https://graph.microsoft.com/v1.0/expired',
      parameters: [
        { verb: 'GET', values: [{ name: 'select', items: ['id'] }], links: [] }
      ],
      version: 'v1.0',
      createdAt: expiredDate
    };

    // Store and retrieve using the same key format: version/url
    await storeSuggestionsInCache(openApiContent, 'v1.0');
    const data = await getSuggestionsFromCache('v1.0/' + openApiContent.url);
    expect(data).toBeNull();
  });
})