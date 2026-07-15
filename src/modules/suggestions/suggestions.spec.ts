jest.mock('../../app/utils/open-api-parser', () => ({
  parseOpenApiResponse: jest.fn((content: any) => ({
    createdAt: '',
    version: '',
    parameters: [{ verb: 'get', values: [], links: ['parsed'] }],
    url: content.url
  }))
}));
jest.mock('../../app/utils/resources/resources-filter', () => ({
  getMatchingResourceForUrl: jest.fn()
}));
jest.mock('./cache-provider', () => ({
  getSuggestionsFromCache: jest.fn(),
  storeSuggestionsInCache: jest.fn()
}));

import { getLastDelimiterInUrl, suggestions } from '.';
import { getMatchingResourceForUrl } from '../../app/utils/resources/resources-filter';
import { getSuggestionsFromCache } from './cache-provider';

describe('Suggestions should ', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  it('Tests getLastDelimiterInUrl', () => {
    const url = 'https://graph.microsoft.com/v1.0/me';
    const result = getLastDelimiterInUrl(url);
    const { symbol } = result;
    expect(symbol).toEqual('/');
  })

  it('return null when getSuggestions fails', () => {
    const url = 'https://api.github.com/search/users?q=tom';
    const api = 'https://api.github.com';
    const version = 'v1';
    return suggestions.getSuggestions(url, api, version, 'paths')
      .then((data) => {
        expect(data).toBeNull();
      })
      .catch((e: Error) => { throw e });
  })

  it('return defined data when correct response is received', () => {
    fetchMock.mockResponse(JSON.stringify({
      ok: true,
      status: 200,
      paths: {
        1: '/users',
        requestUrl: '/users/$count'
      }
    }));
    const url = 'https://test_url';
    const api = 'https://test_api';
    const version = 'v1';
    return suggestions.getSuggestions(url, api, version, 'paths')
      .then((data) => {
        expect(data).toBeDefined();
      })
      .catch((e: Error) => { throw e })
  })

  it('returns resource-based suggestions for paths context with empty url', async () => {
    const resources = {
      children: [
        { segment: 'users' },
        { segment: 'groups' }
      ]
    };
    const result = await suggestions.getSuggestions('', 'https://api', 'v1.0', 'paths', resources as any);
    expect(result).toBeDefined();
    expect(result!.parameters[0].links).toEqual(['users', 'groups']);
  });

  it('returns null for paths with no resources', async () => {
    (getSuggestionsFromCache as jest.Mock).mockResolvedValue(null);
    const result = await suggestions.getSuggestions('users', 'https://api', 'v1.0', 'paths', undefined as any);
    expect(result).toBeNull();
  });

  it('returns cached suggestions if available', async () => {
    const cached = { createdAt: '', version: '', parameters: [], url: 'test' };
    (getSuggestionsFromCache as jest.Mock).mockResolvedValue(cached);
    const result = await suggestions.getSuggestions('users', 'https://api', 'v1.0', 'paths', { children: [] } as any);
    expect(result).toBe(cached);
  });

  it('fetches from network for parameters context', async () => {
    (getSuggestionsFromCache as jest.Mock).mockResolvedValue(null);
    fetchMock.mockResponseOnce(JSON.stringify({ paths: {} }));
    const result = await suggestions.getSuggestions('users', 'https://api', 'v1.0', 'parameters');
    expect(result).toBeDefined();
  });

  it('returns null on network error for parameters', async () => {
    (getSuggestionsFromCache as jest.Mock).mockResolvedValue(null);
    fetchMock.mockRejectOnce(new Error('fail'));
    const result = await suggestions.getSuggestions('users', 'https://api', 'v1.0', 'parameters');
    expect(result).toBeNull();
  });

  it('returns null for banned paths (undefined in URL)', async () => {
    (getSuggestionsFromCache as jest.Mock).mockResolvedValue(null);
    const result = await suggestions.getSuggestions('users/undefined/messages', 'https://api', 'v1.0', 'parameters');
    expect(result).toBeNull();
  });

  it('returns matching children for URL with paths context', async () => {
    (getMatchingResourceForUrl as jest.Mock).mockReturnValue({
      children: [{ segment: 'messages' }, { segment: 'contacts' }]
    });
    const resources = { children: [{ segment: 'users' }] };
    const result = await suggestions.getSuggestions('users', 'https://api', 'v1.0', 'paths', resources as any);
    expect(result).toBeDefined();
    expect(result!.parameters[0].links).toEqual(['messages', 'contacts']);
  });

  it('returns null when matching has no children', async () => {
    (getMatchingResourceForUrl as jest.Mock).mockReturnValue({ children: [] });
    (getSuggestionsFromCache as jest.Mock).mockResolvedValue(null);
    const resources = { children: [{ segment: 'users' }] };
    const result = await suggestions.getSuggestions('users', 'https://api', 'v1.0', 'paths', resources as any);
    expect(result).toBeNull();
  });

  it('returns null when fetch response not ok', async () => {
    (getSuggestionsFromCache as jest.Mock).mockResolvedValue(null);
    fetchMock.mockResponseOnce('Not Found', { status: 404, statusText: 'Not Found' });
    const result = await suggestions.getSuggestions('users', 'https://api', 'v1.0', 'parameters');
    expect(result).toBeNull();
  });

  it('returns null for unknown banned path', async () => {
    (getSuggestionsFromCache as jest.Mock).mockResolvedValue(null);
    const result = await suggestions.getSuggestions('users/unknown/messages', 'https://api', 'v1.0', 'parameters');
    expect(result).toBeNull();
  });
})