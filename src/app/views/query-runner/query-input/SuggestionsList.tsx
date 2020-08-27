import { getTheme, Label } from 'office-ui-fabric-react';
import React, { useEffect } from 'react';

import { ISuggestionsList } from '../../../../types/auto-complete';
import { queryInputStyles } from './QueryInput.styles';

const SuggestionsList = ({ filteredSuggestions, activeSuggestion, onClick }: ISuggestionsList) => {
  const currentTheme = getTheme();
  const { suggestions: suggestionClass,
    suggestionOption,
    suggestionActive: activeSuggestionClass,
    suggestionTitle }: any = queryInputStyles(currentTheme).autoComplete;

  const refs = filteredSuggestions.reduce((ref: any, value: any) => {
    const itemIndex = filteredSuggestions.findIndex(k => k === value);
    ref[itemIndex] = React.createRef();
    return ref;
  }, {});

  useEffect(() => {
    if (refs && filteredSuggestions.length > 0) {
      if (refs[activeSuggestion].current) {
        refs[activeSuggestion].current.scrollIntoView({
          behavior: 'smooth', block: 'nearest', inline: 'start'
        });
      }
    }
  }, [activeSuggestion]);

  return (
    <ul style={suggestionClass} aria-haspopup='true'>
      {filteredSuggestions.map((suggestion: {} | null | undefined, index: number) => {
        return (
          <li
            style={(index === activeSuggestion) ? activeSuggestionClass : suggestionOption}
            key={index}
            ref={refs[index]}
            onClick={(e: any) => onClick(e)}
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