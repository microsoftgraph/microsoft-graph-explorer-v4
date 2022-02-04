import { suggestions } from '../../../modules/suggestions/suggestions';

describe('Tests suggestions fetching ', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    fetchMock.resetMocks();
  });
  it('Returns null when getSuggestions fails', () => {
    const url = 'https://api.github.com/search/users?q=tom';
    const api = 'https://api.github.com';
    const version = 'v1';
    return suggestions.getSuggestions(url, api, version)
      .then((data) => {
        expect(data).toBeNull();
      });
  })

  it('Returns defined data when correct response is received', () => {
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
    return suggestions.getSuggestions(url, api, version)
      .then((data) => {
        expect(data).toBeDefined();
      });
  })
})