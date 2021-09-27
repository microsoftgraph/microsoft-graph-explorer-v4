import { IAutoCompleteProps } from '../../../../../types/auto-complete';

export function cleanUpSelectedSuggestion(compare: string, userInput: string, selected: string) {
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

export function getParametersWithVerb(properties: IAutoCompleteProps) {
  const { autoCompleteOptions, sampleQuery: { selectedVerb } } = properties;
  if (!autoCompleteOptions) {
    return;
  }
  const parameters = autoCompleteOptions.parameters;
  if (!parameters) {
    return;
  }
  return parameters.find(parameter => parameter.verb === selectedVerb.toLowerCase());
}

export function getLastCharacterOf(content: string) {
  return content.slice(-1);
}

export function getLastSymbolInUrl(url: string) {
  const availableSymbols = [
    {
      key: '/',
      value: 0
    },
    {
      key: ',',
      value: 0
    },
    {
      key: '$',
      value: 0
    },
    {
      key: '=',
      value: 0
    },
    {
      key: '&',
      value: 0
    },
    {
      key: '?',
      value: 0
    }
  ];

  availableSymbols.forEach(element => {
    element.value = url.lastIndexOf(element.key);
  });
  const max = availableSymbols.reduce((prev, current) => (prev.value > current.value) ? prev : current);
  return max;
}

// Filter out suggestions that don't contain the user's input
export function getFilteredSuggestions(compareString: string, suggestions: string[]) {
  return suggestions.filter((suggestion: string) => {
    return suggestion.toLowerCase().indexOf(compareString.toLowerCase()) > -1;
  });
}
