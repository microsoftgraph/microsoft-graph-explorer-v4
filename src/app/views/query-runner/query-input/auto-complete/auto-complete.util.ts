import { AutoCompleteOption } from '../../../../../types/auto-complete';
import { GRAPH_API_VERSIONS } from '../../../../services/graph-constants';
import { hasWhiteSpace, parseSampleUrl } from '../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../utils/translate-messages';
import { delimiters, getLastDelimiterInUrl } from './utilities/delimiters';

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

function getParametersWithVerb(properties: { options: AutoCompleteOption }) {
  const { options } = properties;
  if (!options) {
    return [];
  }
  const parameters = options.parameters;
  if (!parameters) {
    return [];
  }
  return parameters.find(parameter => parameter.verb === 'get');
}

const getPathOptions = (options: AutoCompleteOption) => {
  const parametersWithVerb = getParametersWithVerb({ options });
  if (!parametersWithVerb) {
    return [];
  }
  return parametersWithVerb.links;
}

const getQueryParameters = (options: AutoCompleteOption) => {
  const parametersWithVerb = getParametersWithVerb({ options });
  if (!parametersWithVerb) {
    return [];
  }

  return parametersWithVerb.values.map((value: { name: any; }) => value.name);
}

const getQueryProperties = (url: string, options: AutoCompleteOption) => {
  const parametersWithVerb = getParametersWithVerb({ options });
  if (!parametersWithVerb) {
    return;
  }
  const param = url.split(delimiters.DOLLAR.symbol).pop()!.split(delimiters.EQUALS.symbol)[0];
  const section = parametersWithVerb.values.find((k: { name: string; }) => {
    return k.name === `${delimiters.DOLLAR.symbol}${param}`;
  });

  if (section && section.items && section.items.length > 0) {
    return section.items;
  }
  return [];
}

function getSuggestions(url: string, autoCompleteOptions: AutoCompleteOption) {
  const { context } = getLastDelimiterInUrl(url);
  if (context === 'parameters') {
    return getQueryParameters(autoCompleteOptions);
  }
  if (context === 'paths') {
    return getPathOptions(autoCompleteOptions);
  }
  if (context === 'properties') {
    return getQueryProperties(url, autoCompleteOptions);
  }
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
  const { queryVersion } = parseSampleUrl(queryUrl);
  if (!GRAPH_API_VERSIONS.includes(queryVersion)) {
    return translateMessage('Invalid version in URL');
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
  getSearchText,
  getSuggestions
}
