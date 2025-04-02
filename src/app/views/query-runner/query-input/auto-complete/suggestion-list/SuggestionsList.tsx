import { Label, getTheme, mergeStyles } from '@fluentui/react';
import { createRef, useEffect } from 'react';

import { ISuggestionsList } from '../../../../../../types/auto-complete';
import { autoCompleteStyles } from '../AutoComplete.styles';

const SuggestionsList = ({ filteredSuggestions, activeSuggestion, onSuggestionSelected }: ISuggestionsList) => {
  const theme = getTheme();
  const suggestionsClass = mergeStyles(autoCompleteStyles(theme).suggestions);
  const suggestionActiveClass = mergeStyles(autoCompleteStyles(theme).suggestionActive);
  const suggestionOptionClass = mergeStyles(autoCompleteStyles(theme).suggestionOption);
  const suggestionTitleClass = mergeStyles(autoCompleteStyles(theme).suggestionTitle);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refs = filteredSuggestions.reduce((ref: any, value: string) => {
    const itemIndex = filteredSuggestions.findIndex(k => k === value);
    ref[itemIndex] = createRef();
    return ref;
  }, {});

  useEffect(() => {
    if (refs && filteredSuggestions.length > 0) {
      if (refs[activeSuggestion] && refs[activeSuggestion].current) {
        refs[activeSuggestion].current.scrollIntoView({
          behavior: 'smooth', block: 'nearest', inline: 'start'
        });
      }
    }
  }, [activeSuggestion]);

  return (
    <ul className={suggestionsClass} tabIndex={-1}>
      {filteredSuggestions.map((suggestion: string, index: number) => {
        return (
          <li
            className={(index === activeSuggestion) ? suggestionActiveClass : suggestionOptionClass}
            key={index}
            ref={refs[index]}
            onClick={() => onSuggestionSelected(suggestion)}
          >
            <Label className={suggestionTitleClass}>
              {suggestion}
            </Label>
          </li>
        );
      })}
    </ul>
  );
};

export default SuggestionsList;