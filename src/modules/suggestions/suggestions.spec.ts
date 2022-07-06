import { getLastDelimiterInUrl, suggestions } from '.';

describe('Suggestions should ', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    fetchMock.resetMocks();
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
})