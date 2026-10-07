import {
  cleanUpSelectedSuggestion, getFilteredSuggestions, getLastCharacterOf, getSearchText
} from './auto-complete.util';

describe('Tests autocomplete utils', () => {
  it('Tests cleanUpSelectedSuggestion', () => {
    const compare = 'test';
    const userInput = 'test';
    const selected = 'test';
    const result = cleanUpSelectedSuggestion(compare, userInput, selected);
    expect(result).toEqual('test');
  });

  it('Tests cleanUpSelectedSuggestion', () => {
    const compare = '';
    const userInput = 'test';
    const selected = 'test';
    const result = cleanUpSelectedSuggestion(compare, userInput, selected);
    expect(result).toEqual('testtest');
  });

  it('Tests getLastCharacterOf', () => {
    const url = 'https://graph.microsoft.com/v1.0/me';
    const result = getLastCharacterOf(url);
    expect(result).toEqual('e');
  });

  it('Tests getFilteredSuggestions', () => {
    const suggestions = ['test', 'test2', 'test3'];
    const userInput = 'test';
    const result = getFilteredSuggestions(userInput, suggestions);
    expect(result).toEqual(['test', 'test2', 'test3']);
  })

})

describe('Query input util should', () => {

  it('cleanup selected suggestion', async () => {
    const compareString = 'sel';
    const userInput = 'https://graph.microsoft.com/v1.0/me/messages?sel';
    const selected = '$select';
    const selectedSuggestion = cleanUpSelectedSuggestion(compareString, userInput, selected);

    expect(selectedSuggestion).toEqual('https://graph.microsoft.com/v1.0/me/messages?$select');
  });

  it('replace only last occurrence of compare string', async () => {
    const compareString = 'su';
    const userInput = 'https://graph.microsoft.com/v1.0/me/messages?$select=id,subject&orderby=su';
    const selected = 'subject desc';
    const selectedSuggestion = cleanUpSelectedSuggestion(compareString, userInput, selected);

    expect(selectedSuggestion)
      .toEqual('https://graph.microsoft.com/v1.0/me/messages?$select=id,subject&orderby=subject desc');
  });

});

describe('getSearchText', () => {
  it('should return previous and searchText for valid input and index', () => {
    const result = getSearchText('hello world', 4);
    expect(result.previous).toBe('hello');
    expect(result.searchText).toBe(' world');
  });

  it('should return empty strings when input is empty', () => {
    const result = getSearchText('', 5);
    expect(result).toEqual({ previous: '', searchText: '' });
  });

  it('should return empty strings when index is 0', () => {
    const result = getSearchText('hello', 0);
    expect(result).toEqual({ previous: '', searchText: '' });
  });

  it('should return empty strings when input is undefined-like', () => {
    const result = getSearchText(undefined as any, 3);
    expect(result).toEqual({ previous: '', searchText: '' });
  });

  it('should handle index at end of string', () => {
    const result = getSearchText('abc', 2);
    expect(result.previous).toBe('abc');
    expect(result.searchText).toBe('');
  });

  it('should handle index in the middle', () => {
    const result = getSearchText('abcdef', 2);
    expect(result.previous).toBe('abc');
    expect(result.searchText).toBe('def');
  });
});

describe('getFilteredSuggestions - additional cases', () => {
  it('should deduplicate results that match both startsWith and includes', () => {
    const suggestions = ['testItem', 'anotherTest', 'testing'];
    const result = getFilteredSuggestions('test', suggestions);
    expect(result).toEqual(['testItem', 'testing', 'anotherTest']);
  });

  it('should be case insensitive', () => {
    const suggestions = ['User.Read', 'Mail.ReadWrite', 'user.readbasic'];
    const result = getFilteredSuggestions('user', suggestions);
    expect(result).toEqual(['User.Read', 'user.readbasic']);
  });

  it('should return empty array when no match', () => {
    const suggestions = ['alpha', 'beta', 'gamma'];
    const result = getFilteredSuggestions('xyz', suggestions);
    expect(result).toEqual([]);
  });
});