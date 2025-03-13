import { mergeClasses, Option } from '@fluentui/react-components';
import { createRef, useEffect } from 'react';
import { ISuggestionsList } from '../../../../../../types/auto-complete';
import { useSuggestionStyles } from './SuggestionsList.styles';


const SuggestionsList = ({ filteredSuggestions, activeSuggestion, onSuggestionSelected }: ISuggestionsList) => {
  const styles = useSuggestionStyles();
  const itemRefs = filteredSuggestions.map(() => createRef<HTMLDivElement>());

  useEffect(() => {
    if (filteredSuggestions.length > 0 && itemRefs[activeSuggestion]?.current) {
      itemRefs[activeSuggestion].current.scrollIntoView({
        behavior: 'smooth', block: 'nearest', inline: 'start'
      });
    }
  }, [activeSuggestion, itemRefs, filteredSuggestions]);

  return (
    <ul tabIndex={-1} className={styles.suggestions}>
      {filteredSuggestions.map((suggestion: string, index: number) => (
        <Option
          className={mergeClasses(activeSuggestion === index ? styles.suggestionActive : styles.suggestionOption)}
          key={suggestion}
          ref={itemRefs[index]}
          onClick={() => onSuggestionSelected(suggestion)}
          aria-selected={activeSuggestion === index}
        >
          {suggestion}
        </Option>
      ))}
    </ul>
  );
};

export default SuggestionsList;