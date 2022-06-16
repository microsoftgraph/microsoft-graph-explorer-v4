import { hasWhiteSpace } from '../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../utils/translate-messages';

function cleanUpSelectedSuggestion(compare: string, userInput: string, selected: string) {
  let finalSelectedSuggestion = `${userInput + selected}`;
  if (compare) {
    /**
     * Removes the characters used to filter the suggestions
     * and replaces them with the provided suggestion
     */
    finalSelectedSuggestion = userInput.slice(0, -compare.length);
    return finalSelectedSuggestion + selected;
  }
  return finalSelectedSuggestion;
}

function getLastCharacterOf(content: string) {
  return content.slice(-1);
}

// Filter out suggestions that don't contain the user's input
function getFilteredSuggestions(compareString: string, suggestions: string[]) {
  return suggestions.filter((suggestion: string) => {
    return suggestion.toLowerCase().indexOf(compareString.toLowerCase()) > -1;
  });
}

function getErrorMessage(queryUrl: string) {
  if (!queryUrl) {
    return translateMessage('Missing url');
  }
  if (hasWhiteSpace(queryUrl)) {
    return translateMessage('Invalid whitespace in URL');
  }
  return '';
}

function getSearchText(input: string, index: number) {
  const stringPosition = index + 1;
  const previous = input.substring(0, stringPosition);
  const searchText = input.replace(previous, '');
  return { previous, searchText };
}

export {
  getErrorMessage,
  getFilteredSuggestions,
  cleanUpSelectedSuggestion,
  getLastCharacterOf,
  getSearchText
}
