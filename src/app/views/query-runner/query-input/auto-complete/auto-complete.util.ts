import { ValidatedUrl } from '../../../../../modules/validation/abnf';
import { hasPlaceHolders } from '../../../../utils/sample-url-generation';
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

  function getStartsWith() {
    return suggestions.filter((suggestion: string) => {
      return suggestion.toLowerCase().startsWith(compareString.toLocaleLowerCase());
    });
  }

  function getIncludes() {
    return suggestions.filter((suggestion: string) => {
      return suggestion.toLowerCase().indexOf(compareString.toLowerCase()) > -1;
    });
  }

  const filteredSuggestions = getStartsWith().concat(getIncludes());
  return Array.from(new Set(filteredSuggestions));
}

function getErrorMessage(queryUrl: string) {
  if (!queryUrl) {
    return translateMessage('Missing url');
  }

  if (hasPlaceHolders(queryUrl)) {
    return translateMessage('Parts between {} need to be replaced with real values');
  }

  const error = getValidationError(queryUrl);
  if (error) {
    return `${translateMessage('Possible error found in URL near')}: ${error}`;
  }
  if (queryUrl.indexOf('graph.microsoft.com') === -1){
    return translateMessage('The URL must contain graph.microsoft.com');
  }
  return '';
}

function getValidationError(queryUrl: string): string | null {
  const validator = new ValidatedUrl();
  const validation = validator.validate(queryUrl);
  if (!validation.success) {
    return queryUrl.substring(validation.matched, validation.maxMatched);
  }
  return null;
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