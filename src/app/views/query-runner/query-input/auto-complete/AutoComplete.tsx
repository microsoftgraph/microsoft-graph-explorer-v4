import { getTheme, ITextFieldProps, KeyCodes, mergeStyles, Text, TextField } from '@fluentui/react';
import { useContext, useEffect, useRef, useState } from 'react';

import { delimiters, getLastDelimiterInUrl, getSuggestions, SignContext } from '../../../../../modules/suggestions';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { IAutoCompleteProps } from '../../../../../types/auto-complete';
import { ValidationContext } from '../../../../services/context/validation-context/ValidationContext';
import { GRAPH_API_VERSIONS, GRAPH_URL } from '../../../../services/graph-constants';
import { fetchAutoCompleteOptions } from '../../../../services/slices/autocomplete.slice';
import { sanitizeQueryUrl } from '../../../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../utils/translate-messages';
import { queryInputStyles } from '../QueryInput.styles';
import {
  cleanUpSelectedSuggestion, getFilteredSuggestions,
  getSearchText
} from './auto-complete.util';
import SuffixRenderer from './suffix/SuffixRenderer';
import SuggestionsList from './suggestion-list/SuggestionsList';
import { usePrevious } from './use-previous';

const AutoComplete = (props: IAutoCompleteProps) => {

  const dispatch = useAppDispatch();
  const validation = useContext(ValidationContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const focusRef = useRef<any>(null);

  let element: HTMLDivElement | null | undefined = null;

  const sampleQuery = useAppSelector((state)=> state.sampleQuery);
  const autoCompleteOptions = useAppSelector((state)=> state.autoComplete.data);
  const autoCompletePending = useAppSelector((state)=> state.autoComplete.pending);

  const previousQuery = usePrevious(sampleQuery.sampleUrl);
  const [isMultiline, setIsMultiline] = useState<boolean>(false);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [queryUrl, setQueryUrl] = useState<string>(sampleQuery.sampleUrl);
  const [shouldShowSuggestions, setShouldShowSuggestions] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [backSpacing, setBackspacing] = useState<boolean>(false);

  useEffect(() => {
    setQueryUrl(sampleQuery.sampleUrl);
  }, [sampleQuery.sampleUrl]);

  useEffect(() => {
    if (queryUrl !== previousQuery) {
      displayAutoCompleteSuggestions(queryUrl);
    }
    setIsMultiline(isOverflowing(queryUrl));
  }, [autoCompleteOptions, queryUrl]);

  const setFocus = () => {
    focusRef?.current?.focus();
  }

  const updateUrlContent = (e: React.FocusEvent<HTMLInputElement>) => {
    const targetValue = e.target.value;
    setQueryUrl(targetValue);
    props.contentChanged(targetValue);
  };

  const initialiseAutoComplete = (currentValue: string) => {
    if (currentValue.includes(GRAPH_URL)) {
      const { index, context } = getLastDelimiterInUrl(currentValue);
      const { searchText: searchWith, previous: preceedingText } = getSearchText(currentValue, index!);
      setSearchText(searchWith);
      requestForAutocompleteOptions(preceedingText, context);
    }
  }

  const onChange = (event_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setQueryUrl(newValue!);
    initialiseAutoComplete(newValue!)
  };

  const isOverflowing = (input: string) => {

    function getTextWidth(text: string) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (context === null) {
        return 0;
      }

      context.font = getComputedStyle(document.body).font;
      return context.measureText(text).width + 5;
    }

    return !!element && getTextWidth(input) > element.scrollWidth;
  }

  const selectSuggestion = (suggestion: string) => {
    appendSuggestionToUrl(suggestion);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.keyCode) {
    case KeyCodes.enter:
      event.preventDefault();
      handleEnterKeyPressed();
      break;

    case KeyCodes.tab:
      if (shouldShowSuggestions) {
        event.preventDefault();
        handleTabKeyPressed();
      }
      break;

    case KeyCodes.up:
      event.preventDefault();
      handleUpKeyPressed();
      break;

    case KeyCodes.down:
      event.preventDefault();
      handleDownKeyPressed();
      break;

    case KeyCodes.escape:
      handleEscapeKeyPressed();
      break;

    case KeyCodes.backspace:
      setBackspacing(true);
      break;

    default:
      setBackspacing(false);
      break;
    }
  };

  function handleEscapeKeyPressed() {
    if (shouldShowSuggestions) {
      props.contentChanged(queryUrl);
      setShouldShowSuggestions(false);
    }
  }

  function handleDownKeyPressed() {
    if (shouldShowSuggestions) {
      let active = activeSuggestion + 1;
      if (activeSuggestion === suggestions.length - 1) {
        active = 0;
      }
      setActiveSuggestion(active);
    }
  }

  function handleUpKeyPressed() {
    if (shouldShowSuggestions) {
      let active = activeSuggestion - 1;
      if (activeSuggestion === 0) {
        active = suggestions.length - 1;
      }
      setActiveSuggestion(active);
    }
  }

  function handleTabKeyPressed() {
    const selected = suggestions[activeSuggestion];
    appendSuggestionToUrl(selected);
    setShouldShowSuggestions(false);
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

  const requestForAutocompleteOptions = (url: string, context: SignContext) => {
    const signature = sanitizeQueryUrl(url);
    const { requestUrl, queryVersion } = parseSampleUrl(signature);
    const urlExistsInStore = autoCompleteOptions && requestUrl === autoCompleteOptions.url &&
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

  const displayAutoCompleteSuggestions = (url: string) => {

    setShouldShowSuggestions(false);

    const { index } = getLastDelimiterInUrl(url);
    const { previous: preceedingText, searchText: searchTerm } = getSearchText(url, index!);
    const shouldSuggestVersions = preceedingText === GRAPH_URL + '/';

    setShouldShowSuggestions(false);

    let theSuggestions: string[] = [];
    if (shouldSuggestVersions) {
      theSuggestions = GRAPH_API_VERSIONS;
    }
    else if (autoCompleteOptions) {
      theSuggestions = getSuggestions(url, autoCompleteOptions);
    }

    if (theSuggestions.length === 0) {
      return;
    }

    const filtered = (searchText) ? getFilteredSuggestions(searchText, theSuggestions) : theSuggestions;
    if (filtered.length > 0) {
      setSuggestions(filtered);
      setShouldShowSuggestions(true);
    }

    if (filtered.length === 1 && filtered[0] === searchTerm && !backSpacing) {
      appendSuggestionToUrl(searchTerm);
    }
  }

  const trackSuggestionSelectionEvent = (suggestion: string) => {
    telemetry.trackEvent(eventTypes.DROPDOWN_CHANGE_EVENT,
      {
        ComponentName: componentNames.QUERY_URL_AUTOCOMPLETE_DROPDOWN,
        QuerySignature: sanitizeQueryUrl(queryUrl),
        SelectedSuggestion: suggestion
      });
  }

  const appendSuggestionToUrl = (selected: string) => {
    if (!selected) { return; }
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

  const renderSuffix = () => {
    return <SuffixRenderer />;
  }

  const closeSuggestionDialog = (event: React.FocusEvent<HTMLInputElement>) => {
    const { currentTarget, relatedTarget } = event;
    if (!currentTarget.contains(relatedTarget as Node) && shouldShowSuggestions) {
      setShouldShowSuggestions(false);
    }
  }

  const currentTheme = getTheme();
  const autoInput = mergeStyles(queryInputStyles(currentTheme).autoComplete);

  const handleRenderDescription = (properties?: ITextFieldProps): JSX.Element | null => {
    if (!shouldShowSuggestions && !autoCompletePending && properties?.description) {
      return (
        <Text variant="small" >
          {properties?.description}
        </Text>
      );
    }
    return null;
  };

  function getErrorMessage() {
    validation.validate(queryUrl);
    return validation.error;
  }
  const [descriptionError, setDescriptionError] = useState('');

  useEffect(()=>{
    const errorMessage = getErrorMessage();
    if (errorMessage) {
      setDescriptionError(errorMessage)
    } else {
      setDescriptionError('')
    }
  }, [getErrorMessage])

  return (
    <div onBlur={closeSuggestionDialog}>
      <div ref={(el) => { element = el }}>
        <TextField
          className={autoInput}
          multiline={isMultiline}
          autoAdjustHeight
          resizable={false}
          type='text'
          autoComplete='off'
          onChange={onChange}
          onBlur={updateUrlContent}
          onKeyDown={onKeyDown}
          value={queryUrl}
          componentRef={focusRef}
          onRenderSuffix={(renderSuffix()) ? renderSuffix : undefined}
          ariaLabel={translateMessage('Query Sample Input')}
          role='textbox'
          onRenderDescription={handleRenderDescription}
          description={descriptionError}
        />
      </div>
      {shouldShowSuggestions && queryUrl && suggestions.length > 0 &&
        <SuggestionsList
          filteredSuggestions={suggestions}
          activeSuggestion={activeSuggestion}
          onSuggestionSelected={selectSuggestion} />}
    </div>
  );
}

export default AutoComplete;