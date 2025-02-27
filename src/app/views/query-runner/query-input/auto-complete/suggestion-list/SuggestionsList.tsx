import { Label } from '@fluentui/react-components';
import { createRef, useEffect } from 'react';

import { ISuggestionsList } from '../../../../../../types/auto-complete';

const SuggestionsList = ({ filteredSuggestions, activeSuggestion, onSuggestionSelected }: ISuggestionsList) => {

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
    <ul tabIndex={-1}>
      {filteredSuggestions.map((suggestion: string, index: number) => {
        return (
          <li
            key={index}
            ref={refs[index]}
            onClick={() => onSuggestionSelected(suggestion)}
          >
            <Label>
              {suggestion}
            </Label>
          </li>
        );
      })}
    </ul>
  );
};

export default SuggestionsList;