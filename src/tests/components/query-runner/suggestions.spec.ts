import { suggestions } from '../../../modules/suggestions/suggestions';

describe('Tests suggestions fetching ', () => {
  it('Returns null when getSuggestions fails', () => {
    const url = 'https://api.github.com/search/users?q=tom';
    const api = 'https://api.github.com';
    const version = 'v1';
    return suggestions.getSuggestions(url, api, version)
      .then((data) => {
        expect(data).toBeNull();
      });
  })
})