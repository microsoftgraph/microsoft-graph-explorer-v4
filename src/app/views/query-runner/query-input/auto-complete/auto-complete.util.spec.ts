import {
  cleanUpSelectedSuggestion, getFilteredSuggestions, getLastCharacterOf
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