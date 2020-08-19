import { getTheme, Label } from 'office-ui-fabric-react';
import React from 'react';

import { ISuggestionsList } from '../../../../types/auto-complete';
import { queryInputStyles } from './QueryInput.styles';


const SuggestionsList = ({ filteredSuggestions, activeSuggestion, onClick }: ISuggestionsList) => {
  const currentTheme = getTheme();
  const { suggestions: suggestionClass,
    suggestionOption,
    suggestionActive: activeSuggestionClass,
    suggestionTitle }: any = queryInputStyles(currentTheme).autoComplete;

  return (
    <ul style={suggestionClass} aria-haspopup='true'>
      {filteredSuggestions.map((suggestion: {} | null | undefined, index: number) => {
        return (
          <li
            style={(index === activeSuggestion) ? activeSuggestionClass : suggestionOption}
            key={index}
            onClick={() => onClick}
          >
            <Label style={suggestionTitle}>
              {suggestion}
            </Label>
          </li>
        );
      })}
    </ul>
  );
};

export default SuggestionsList;