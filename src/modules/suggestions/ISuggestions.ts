import { IParsedOpenApiResponse } from '../../types/open-api';
export default interface ISuggestions {
  getSuggestions(url: string, api: string, version: string): Promise<IParsedOpenApiResponse | null>;
}