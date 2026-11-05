import { IParsedOpenApiResponse } from '../../types/open-api';
import { suggestions } from './suggestions';
import { delimiters, getLastDelimiterInUrl, getSuggestions } from './utilities';
import { IDevxAPI } from '../../types/devx-api';

export interface ISuggestions {
  getSuggestions(url: string, api: IDevxAPI, version: string,
    context: SignContext): Promise<IParsedOpenApiResponse | null>;
}

export type SignContext = 'paths' | 'properties' | 'parameters';

export {
  suggestions,
  delimiters,
  getLastDelimiterInUrl,
  getSuggestions
};
