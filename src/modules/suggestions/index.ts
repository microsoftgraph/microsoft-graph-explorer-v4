import { IParsedOpenApiResponse } from '../../types/open-api';
import { suggestions } from './suggestions';
import { delimiters, getLastDelimiterInUrl, getSuggestions } from './utilities';

export interface ISuggestions {
  getSuggestions(url: string, api: string, version: string,
    context: SignContext): Promise<IParsedOpenApiResponse | null>;
}

export type SignContext = 'paths' | 'properties' | 'parameters';

export {
  suggestions,
  delimiters,
  getLastDelimiterInUrl,
  getSuggestions
};
