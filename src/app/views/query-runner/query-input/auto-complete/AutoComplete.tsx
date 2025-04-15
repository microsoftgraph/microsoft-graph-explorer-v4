import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  ChangeEvent,
  KeyboardEvent,
  FocusEvent
} from 'react';
import {
  Input,
  Textarea,
  Text,
  makeStyles
} from '@fluentui/react-components';

import { useAppDispatch, useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { IAutoCompleteProps } from '../../../../../types/auto-complete';
import { ValidationContext } from '../../../../services/context/validation-context/ValidationContext';
import { GRAPH_API_VERSIONS, GRAPH_URL } from '../../../../services/graph-constants';
import { fetchAutoCompleteOptions } from '../../../../services/slices/autocomplete.slice';
import { sanitizeQueryUrl } from '../../../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../utils/translate-messages';
import { delimiters, getLastDelimiterInUrl, getSuggestions, SignContext } from '../../../../../modules/suggestions';
import {
  cleanUpSelectedSuggestion,
  getFilteredSuggestions,
  getSearchText
} from './auto-complete.util';
import SuffixRenderer from './suffix/SuffixRenderer';
import SuggestionsList from './suggestion-list/SuggestionsList';
import { usePrevious } from './use-previous';

const useStyles = makeStyles({
  container: {
    margin: 0,
    display: 'block'
  },
  autoInput: {
    width: '100%'
  },
  noResize: {
    resize: 'none'
  }
});

const KEYCODES = {
  ENTER: 'Enter',
  TAB: 'Tab',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  ESCAPE: 'Escape',
  BACKSPACE: 'Backspace'
};

function AutoComplete(props: IAutoCompleteProps) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const validation = useContext(ValidationContext);

  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const autoCompleteOptions = useAppSelector((state) => state.autoComplete.data);
  const autoCompletePending = useAppSelector((state) => state.autoComplete.pending);

  const previousQuery = usePrevious(sampleQuery.sampleUrl);
  const [queryUrl, setQueryUrl] = useState<string>(sampleQuery.sampleUrl);
  const [isMultiline, setIsMultiline] = useState<boolean>(false);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [shouldShowSuggestions, setShouldShowSuggestions] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [backSpacing, setBackspacing] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<string>('');

  const focusRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQueryUrl(sampleQuery.sampleUrl);
  }, [sampleQuery.sampleUrl]);

  useEffect(() => {
    if (queryUrl !== previousQuery) {
      displayAutoCompleteSuggestions(queryUrl);
    }
    setIsMultiline(isOverflowing(queryUrl));
  }, [autoCompleteOptions, queryUrl]);

  useEffect(() => {
    const errorMessage = getErrorMessage();
    if (errorMessage) {
      setDescriptionError(errorMessage);
    } else {
      setDescriptionError('');
    }
  }, [queryUrl, validation]);

  function setFocus() {
    focusRef.current?.focus();
  }

  function updateUrlContent(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const targetValue = e.currentTarget.value;
    setQueryUrl(targetValue);
    props.contentChanged(targetValue);
  }

  function onChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) {
    const val = newValue ?? e.currentTarget.value;
    setQueryUrl(val);
    initialiseAutoComplete(val);
  }

  function initialiseAutoComplete(currentValue: string) {
    if (currentValue.includes(GRAPH_URL)) {
      const { index, context } = getLastDelimiterInUrl(currentValue);
      const { searchText: searchWith, previous: preceedingText } = getSearchText(
        currentValue,
        index!
      );
      setSearchText(searchWith);
      requestForAutocompleteOptions(preceedingText, context);
    }
  }

  function requestForAutocompleteOptions(url: string, context: SignContext) {
    const signature = sanitizeQueryUrl(url);
    const { requestUrl, queryVersion } = parseSampleUrl(signature);
    const urlExistsInStore =
      autoCompleteOptions &&
      requestUrl === autoCompleteOptions.url &&
      queryVersion === autoCompleteOptions.version;

    if (urlExistsInStore) {
      displayAutoCompleteSuggestions(autoCompleteOptions.url);
      return;
    }

    if (!requestUrl) {
      dispatch(fetchAutoCompleteOptions({ url: '', version: queryVersion }));
      return;
    }

    dispatch(fetchAutoCompleteOptions({ url: requestUrl, version: queryVersion, context }));
  }

  function displayAutoCompleteSuggestions(url: string) {
    setShouldShowSuggestions(false);

    const { index } = getLastDelimiterInUrl(url);
    const { previous: preceedingText, searchText: searchTerm } = getSearchText(url, index!);
    const shouldSuggestVersions = preceedingText === GRAPH_URL + '/';

    let theSuggestions: string[] = [];
    if (shouldSuggestVersions) {
      theSuggestions = GRAPH_API_VERSIONS;
    } else if (autoCompleteOptions) {
      theSuggestions = getSuggestions(url, autoCompleteOptions);
    }

    if (theSuggestions.length === 0) {
      return;
    }

    const filtered = searchText
      ? getFilteredSuggestions(searchText, theSuggestions)
      : theSuggestions;
    if (filtered.length > 0) {
      setSuggestions(filtered);
      setShouldShowSuggestions(true);
    }

    if (filtered.length === 1 && filtered[0] === searchTerm && !backSpacing) {
      appendSuggestionToUrl(searchTerm);
    }
  }

  function appendSuggestionToUrl(selected: string) {
    if (!selected) {return;}
    const { context } = getLastDelimiterInUrl(queryUrl);
    let query = selected;

    if (selected.startsWith(delimiters.DOLLAR.symbol) && context === 'parameters') {
      selected += delimiters.EQUALS.symbol;
      query = '';
    }
    setSearchText(query);

    const selectedSuggestion = cleanUpSelectedSuggestion(searchText, queryUrl, selected);
    setQueryUrl(selectedSuggestion);
    props.contentChanged(selectedSuggestion);

    setActiveSuggestion(0);
    setSuggestions([]);
    setShouldShowSuggestions(false);
    setFocus();

    trackSuggestionSelectionEvent(selected);
  }

  function trackSuggestionSelectionEvent(suggestion: string) {
    telemetry.trackEvent(eventTypes.DROPDOWN_CHANGE_EVENT, {
      ComponentName: componentNames.QUERY_URL_AUTOCOMPLETE_DROPDOWN,
      QuerySignature: sanitizeQueryUrl(queryUrl),
      SelectedSuggestion: suggestion
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    switch (event.key) {
    case KEYCODES.ENTER:
      event.preventDefault();
      handleEnterKeyPressed();
      break;

    case KEYCODES.TAB:
      if (shouldShowSuggestions) {
        event.preventDefault();
        handleTabKeyPressed();
      }
      break;

    case KEYCODES.UP:
      event.preventDefault();
      handleUpKeyPressed();
      break;

    case KEYCODES.DOWN:
      event.preventDefault();
      handleDownKeyPressed();
      break;

    case KEYCODES.ESCAPE:
      handleEscapeKeyPressed();
      break;

    case KEYCODES.BACKSPACE:
      setBackspacing(true);
      break;

    default:
      setBackspacing(false);
      break;
    }
  }

  function handleEnterKeyPressed() {
    if (shouldShowSuggestions) {
      const selected = suggestions[activeSuggestion];
      appendSuggestionToUrl(selected);
    } else {
      props.contentChanged(queryUrl);
      props.runQuery(queryUrl);
    }
  }

  function handleTabKeyPressed() {
    const selected = suggestions[activeSuggestion];
    appendSuggestionToUrl(selected);
    setShouldShowSuggestions(false);
  }

  function handleUpKeyPressed() {
    if (shouldShowSuggestions) {
      let active = activeSuggestion - 1;
      if (active < 0) {
        active = suggestions.length - 1;
      }
      setActiveSuggestion(active);
    }
  }

  function handleDownKeyPressed() {
    if (shouldShowSuggestions) {
      let active = activeSuggestion + 1;
      if (active > suggestions.length - 1) {
        active = 0;
      }
      setActiveSuggestion(active);
    }
  }

  function handleEscapeKeyPressed() {
    if (shouldShowSuggestions) {
      props.contentChanged(queryUrl);
      setShouldShowSuggestions(false);
    }
  }

  function selectSuggestion(suggestion: string) {
    appendSuggestionToUrl(suggestion);
  }

  function closeSuggestionDialog(event: React.FocusEvent<HTMLDivElement>) {
    const { currentTarget, relatedTarget } = event;
    if (!currentTarget.contains(relatedTarget as Node) && shouldShowSuggestions) {
      setShouldShowSuggestions(false);
    }
  }

  function isOverflowing(input: string) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !containerRef.current) {
      return false;
    }

    ctx.font = getComputedStyle(document.body).font;
    const width = ctx.measureText(input).width + 5;
    return width > containerRef.current.scrollWidth;
  }

  function getErrorMessage(): string {
    validation.validate(queryUrl);
    return validation.error || '';
  }

  function renderSuffix() {
    return <SuffixRenderer />;
  }

  return (
    <div
      className={classes.container}
      onBlur={closeSuggestionDialog}
      ref={containerRef}
    >
      {isMultiline ? (
        <Textarea
          value={queryUrl}
          aria-label={translateMessage('Query Sample Input')}
          className={`${classes.autoInput} ${classes.noResize}`}
          style={{ minHeight: '32px' }} // approximate
          autoComplete="off"
          onChange={(e) => onChange(e)}
          onBlur={updateUrlContent}
          onKeyDown={onKeyDown}
        />
      ) : (
        <Input
          value={queryUrl}
          aria-label={translateMessage('Query Sample Input')}
          className={classes.autoInput}
          type="text"
          autoComplete="off"
          onChange={(e) => onChange(e)}
          onBlur={updateUrlContent}
          onKeyDown={onKeyDown}
          contentAfter={renderSuffix() ? renderSuffix() : undefined}
        />
      )}

      {descriptionError && !shouldShowSuggestions && !autoCompletePending && (
        <Text size={200}>
          {descriptionError}
        </Text>
      )}

      {shouldShowSuggestions && queryUrl && suggestions.length > 0 && (
        <SuggestionsList
          filteredSuggestions={suggestions}
          activeSuggestion={activeSuggestion}
          onSuggestionSelected={selectSuggestion}
        />
      )}
    </div>
  );
}

export default AutoComplete;
