export interface IAutoCompleteProps {
    suggestions: string[];
    contentChanged: Function;
    sampleUrl: string;
    fetchingSuggestions: boolean;
    autoCompleteOptions: {
      url: string;
      parameters: any[];
      verb: string;
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