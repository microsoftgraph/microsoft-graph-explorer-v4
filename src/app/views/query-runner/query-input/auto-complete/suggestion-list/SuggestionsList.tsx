import { Label, styled } from '@fluentui/react';
import { createRef, useEffect } from 'react';

import { ISuggestionsList } from '../../../../../../types/auto-complete';
import { classNames } from '../../../../classnames';
import { autoCompleteStyles } from '../AutoComplete.styles';

const StyledSuggesions = (props: any) => {
  const { filteredSuggestions, activeSuggestion, onClick }: ISuggestionsList = props;
  const classes = classNames(props);

  const refs = filteredSuggestions.reduce((ref: any, value: any) => {
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
    <ul className={classes.suggestions} tabIndex={-1}>
      {filteredSuggestions.map((suggestion: string, index: number) => {
        return (
          <li
            className={(index === activeSuggestion) ? classes.suggestionActive : classes.suggestionOption}
            key={index}
            ref={refs[index]}
            onClick={(e: any) => onClick(e)}
          >
            <Label className={classes.suggestionTitle}>
              {suggestion}
            </Label>
          </li>
        );
      })}
    </ul>
  );
};

// @ts-ignore
const SuggestionsList = styled(StyledSuggesions, autoCompleteStyles);
export default SuggestionsList;