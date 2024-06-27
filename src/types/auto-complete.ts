import { IApiResponse } from './action';
import { IParsedOpenApiResponse } from './open-api';

export interface AutoCompleteOption {
  url: string;
  parameters: any[];
}

export interface IAutoCompleteProps {
  contentChanged: Function;
  runQuery: Function;
}

export interface IAutoCompleteState {
  activeSuggestion: number;
  filteredSuggestions: string[];
  suggestions: string[];
  showSuggestions: boolean;
  userInput: string;
  compare: string;
  queryUrl: string;
  multiline: boolean;
}

export interface ISuggestionsList {
  activeSuggestion: number;
  filteredSuggestions: string[];
  onSuggestionSelected: (suggestion: string) => void;
}

export interface AutocompleteResponse {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  data?: IParsedOpenApiResponse | null;
  error?: Error | null;
}