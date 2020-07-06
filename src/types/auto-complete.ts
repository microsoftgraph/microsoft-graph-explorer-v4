import { IQuery } from './query-runner';

export interface IAutoCompleteProps {
    suggestions: string[];
    contentChanged: Function;
    sampleQuery: IQuery;
    fetchingSuggestions: boolean;
    autoCompleteOptions: {
      url: string;
      parameters: any[];
    };
    actions?: {
      fetchAutoCompleteOptions: Function;
    };
  }

export interface IAutoCompleteState {
    activeSuggestion: number;
    filteredSuggestions: string[];
    suggestions: string[];
    showSuggestions: boolean;
    userInput: string;
    compare: string;

}