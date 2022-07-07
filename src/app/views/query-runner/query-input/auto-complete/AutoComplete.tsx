import { getTheme, KeyCodes, TextField } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { delimiters, getLastDelimiterInUrl, getSuggestions, SignContext } from '../../../../../modules/suggestions';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { IAutoCompleteProps } from '../../../../../types/auto-complete';
import { IRootState } from '../../../../../types/root';
import { fetchAutoCompleteOptions } from '../../../../services/actions/autocomplete-action-creators';
import { GRAPH_API_VERSIONS, GRAPH_URL } from '../../../../services/graph-constants';
import { sanitizeQueryUrl } from '../../../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../utils/translate-messages';
import { queryInputStyles } from '../QueryInput.styles';
import {
  cleanUpSelectedSuggestion, getErrorMessage, getFilteredSuggestions,
  getSearchText
} from './auto-complete.util';
import SuffixRenderer from './suffix/SuffixRenderer';
import SuggestionsList from './suggestion-list/SuggestionsList';

const AutoComplete = (props: IAutoCompleteProps) => {

  const dispatch = useDispatch();
  const focusRef = useRef<any>(null);

  let element: HTMLDivElement | null | undefined = null;

  const { sampleQuery, autoComplete: { data: autoCompleteOptions } } = useSelector(
    (state: IRootState) => state
  );

  const [isMultiline, setIsMultiline] = useState<boolean>(false);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [queryUrl, setQueryUrl] = useState<string>(sampleQuery.sampleUrl);
  const [shouldShowSuggestions, setShouldShowSuggestions] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setQueryUrl(sampleQuery.sampleUrl);
  }, [sampleQuery.sampleUrl]);

  useEffect(() => {
    const { requestUrl } = parseSampleUrl(queryUrl);
    const urlExistsInStore = autoCompleteOptions && requestUrl === autoCompleteOptions.url;
    if (urlExistsInStore) {
      displayAutoCompleteSuggestions(queryUrl);
    }
    setIsMultiline(isOverflowing(queryUrl));
  }, [autoCompleteOptions, queryUrl]);

  const setFocus = () => {
    focusRef?.current?.focus();
  }

  const updateUrlContent = (e: any) => {
    const targetValue = e.target.value;
    setQueryUrl(targetValue);
    props.contentChanged(targetValue);
  };

  const onChange = (e: any) => {
    const currentValue = e.target.value;
    setQueryUrl(currentValue);

    if (currentValue.includes(GRAPH_URL)) {
      const { index, context } = getLastDelimiterInUrl(currentValue);
      const { searchText: searchWith, previous: preceedingText } = getSearchText(currentValue, index!);
      setSearchText(searchWith);
      requestForAutocompleteOptions(preceedingText, context);
    }
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

  const selectSuggestion = (e: any) => {
    appendSuggestionToUrl(e.currentTarget.innerText);
  };

  const onKeyDown = (event: any) => {
    switch (event.keyCode) {
      case KeyCodes.enter:
        event.preventDefault();
        if (shouldShowSuggestions) {
          const selected = suggestions[activeSuggestion];
          appendSuggestionToUrl(selected);
        } else {
          props.contentChanged(queryUrl);
          props.runQuery();
        }
        break;

      case KeyCodes.tab:
        if (shouldShowSuggestions) {
          event.preventDefault();
          const selected = suggestions[activeSuggestion];
          appendSuggestionToUrl(selected);
        }
        break;

      case KeyCodes.up:
        event.preventDefault();
        if (shouldShowSuggestions) {
          let active = activeSuggestion - 1;
          if (activeSuggestion === 0) {
            active = suggestions.length - 1;
          }
          setActiveSuggestion(active);
        }
        break;

      case KeyCodes.down:
        event.preventDefault();
        if (shouldShowSuggestions) {
          let active = activeSuggestion + 1;
          if (activeSuggestion === suggestions.length - 1) {
            active = 0;
          }
          setActiveSuggestion(active);
        }
        break;

      case KeyCodes.escape:
        if (shouldShowSuggestions) {
          setShouldShowSuggestions(false);
        }
        break;

      default:
        break;
    }
  };


  const requestForAutocompleteOptions = (url: string, context: SignContext) => {
    const signature = sanitizeQueryUrl(url);
    const { requestUrl, queryVersion } = parseSampleUrl(signature);
    if (!GRAPH_API_VERSIONS.includes(queryVersion.toLowerCase())) {
      return;
    }

    if (!requestUrl) {
      dispatch(fetchAutoCompleteOptions('', queryVersion));
      return;
    }

    const urlExistsInStore = autoCompleteOptions && requestUrl === autoCompleteOptions.url;
    if (urlExistsInStore) {
      displayAutoCompleteSuggestions(autoCompleteOptions.url);
      return;
    }
    dispatch(fetchAutoCompleteOptions(requestUrl, queryVersion, context));
  }

  const displayAutoCompleteSuggestions = (url: string) => {

    const { index } = getLastDelimiterInUrl(url);
    const { previous: preceedingText } = getSearchText(url, index!);
    const shouldSuggestVersions = preceedingText === GRAPH_URL + '/';

    let theSuggestions: string[] = [];
    if (shouldSuggestVersions) {
      theSuggestions = GRAPH_API_VERSIONS;
    }
    else if (autoCompleteOptions) {
      theSuggestions = getSuggestions(url, autoCompleteOptions);
    }

    console.table({ url, preceedingText, autoCompleteOptionsurl: autoCompleteOptions?.url, searchText });

    if (theSuggestions.length > 0) {
      const filtered = (searchText) ? getFilteredSuggestions(searchText, theSuggestions) : theSuggestions;
      if (filtered[0] !== searchText) {
        setSuggestions(filtered);
        setShouldShowSuggestions(true);
      }
    } else {
      setShouldShowSuggestions(false);
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

    let query = selected;
    if (selected.startsWith(delimiters.DOLLAR.symbol)) {
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

  const closeSuggestionDialog = (event: any) => {
    const { currentTarget, relatedTarget } = event;
    if (!currentTarget.contains(relatedTarget as Node) && shouldShowSuggestions) {
      setShouldShowSuggestions(false);
      console.log('closeSuggestionDialog')
    }
  }

  const currentTheme = getTheme();
  const {
    input: autoInput
  }: any = queryInputStyles(currentTheme).autoComplete;


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
          errorMessage={getErrorMessage(queryUrl)}
        />
      </div>
      {shouldShowSuggestions && queryUrl && suggestions.length > 0 &&
        <SuggestionsList
          filteredSuggestions={suggestions}
          activeSuggestion={activeSuggestion}
          onClick={(e: any) => selectSuggestion(e)} />}
    </div>
  );
}

export default AutoComplete;