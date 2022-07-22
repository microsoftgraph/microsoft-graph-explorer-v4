import { AutoCompleteOption } from '../../../types/auto-complete';
import { delimiters, getLastDelimiterInUrl } from './delimiters';

function getParametersWithVerb(properties: { options: AutoCompleteOption; }) {
  const { options } = properties;
  if (!options) {
    return null;
  }
  const parameters = options.parameters;
  if (!parameters) {
    return null;
  }
  return parameters.find(parameter => parameter.verb === 'get');
}

const getPathOptions = (options: AutoCompleteOption): string[] => {
  const parametersWithVerb = getParametersWithVerb({ options });
  if (!parametersWithVerb) {
    return [];
  }
  return parametersWithVerb.links;
};

const getQueryParameters = (options: AutoCompleteOption): string[] => {
  const parametersWithVerb = getParametersWithVerb({ options });
  if (!parametersWithVerb) {
    return [];
  }

  return parametersWithVerb.values.map((value: { name: any; }) => value.name);
};

const getQueryProperties = (url: string, options: AutoCompleteOption): string[] => {
  const parametersWithVerb = getParametersWithVerb({ options });
  if (!parametersWithVerb) {
    return [];
  }
  const param = url.split(delimiters.DOLLAR.symbol).pop()!.split(delimiters.EQUALS.symbol)[0];
  const section = parametersWithVerb.values.find((k: { name: string; }) => {
    return k.name === `${delimiters.DOLLAR.symbol}${param}`;
  });

  if (section && section.items && section.items.length > 0) {
    return section.items;
  }
  return [];
};

function getSuggestions(url: string, autoCompleteOptions: AutoCompleteOption): string[] {
  const { context } = getLastDelimiterInUrl(url);
  let suggestions: string[] = [];
  if (context === 'parameters') {
    suggestions = getQueryParameters(autoCompleteOptions);
  }

  if (context === 'paths') {
    suggestions = getPathOptions(autoCompleteOptions);
  }

  if (context === 'properties') {
    suggestions = getQueryProperties(url, autoCompleteOptions);
  }

  return suggestions;
}

export {
  getSuggestions
};

