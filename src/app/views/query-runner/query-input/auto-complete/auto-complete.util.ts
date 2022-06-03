import { AutoCompleteOption } from '../../../../../types/auto-complete';
import { IQuery } from '../../../../../types/query-runner';
import { GRAPH_API_VERSIONS } from '../../../../services/graph-constants';
import { hasWhiteSpace, parseSampleUrl } from '../../../../utils/sample-url-generation';
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

function getParametersWithVerb(properties: { options: AutoCompleteOption, sampleQuery: IQuery }) {
  const { options, sampleQuery: { selectedVerb } } = properties;
  if (!options) {
    return;
  }
  const parameters = options.parameters;
  if (!parameters) {
    return;
  }
  return parameters.find(parameter => parameter.verb === selectedVerb.toLowerCase());
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

export {
  getErrorMessage,
  getFilteredSuggestions,
  getParametersWithVerb,
  cleanUpSelectedSuggestion,
  getLastCharacterOf
}
