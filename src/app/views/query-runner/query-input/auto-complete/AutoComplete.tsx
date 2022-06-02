import { getTheme, KeyCodes, TextField } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { IAutoCompleteProps } from '../../../../../types/auto-complete';
import { SortOrder } from '../../../../../types/enums';
import { IRootState } from '../../../../../types/root';
import { fetchAutoCompleteOptions } from '../../../../services/actions/autocomplete-action-creators';
import { GRAPH_API_VERSIONS } from '../../../../services/graph-constants';
import { dynamicSort } from '../../../../utils/dynamic-sort';
import { sanitizeQueryUrl } from '../../../../utils/query-url-sanitization';
import { hasWhiteSpace, parseSampleUrl, removeExtraSlashesFromUrl } from '../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../utils/translate-messages';
import { queryInputStyles } from '../QueryInput.styles';
import {
  cleanUpSelectedSuggestion, getFilteredSuggestions, getLastCharacterOf,
  getLastSymbolInUrl, getParametersWithVerb
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

  const [isMultiline, setIsMultiline] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [suggestions, addSuggestions] = useState<string[]>([]);
  const [compare, setCompare] = useState('');
  const [userInput, setUserInput] = useState(sampleQuery.sampleUrl);
  const [queryUrl, setQueryUrl] = useState(sampleQuery.sampleUrl);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setUserInput(sampleQuery.sampleUrl);
    setQueryUrl(sampleQuery.sampleUrl);
  }, [sampleQuery])

  useEffect(() => {
    if (autoCompleteOptions) {
      performLocalSearch(userInput);
    }
    setIsMultiline(isOverflowing(userInput));
  }, [autoCompleteOptions, userInput]);

  const setFocus = () => {
    focusRef?.current?.focus();
  }

  const updateUrlContent = (e: any) => {
    props.contentChanged(e.target.value);
  };

  const onChange = (e: any) => {
    const previousUserInput = userInput;
    const targetValue = e.target.value;
    setIsMultiline(isOverflowing(targetValue));
    setUserInput(targetValue);
    setQueryUrl(targetValue);

    if (showSuggestions && suggestions.length) {
      let compareString = targetValue.replace(previousUserInput, '');
      compareString = (compare) ? compare + compareString : compareString;
      setFilteredSuggestions(getFilteredSuggestions(compareString, suggestions));
      setCompare(compareString);
    }
    initialiseAutoComplete(targetValue);
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

    return !!element && getTextWidth(input) > element!.scrollWidth;
  }

  const selectSuggestion = (e: any) => {
    appendSuggestionToUrl(e.currentTarget.innerText);
  };

  const initialiseAutoComplete = (url: string) => {
    url = removeExtraSlashesFromUrl(url);
    switch (getLastCharacterOf(url)) {
      case '/':
      case '?':
        requestForAutocompleteOptions(url);
        break;

      case '=':

        if (url.includes('?$')) {
          getParameterEnums(url);
        }

        break;

      case ',':
        getParameterEnums(url);
        break;

      case '&':
        getQueryParameters();
        break;

      default:
        break;
    }
  }

  const onKeyDown = (event: any) => {
    switch (event.keyCode) {
      case KeyCodes.enter:
        if (showSuggestions) {
          const selected = filteredSuggestions[activeSuggestion];
          appendSuggestionToUrl(selected);
        } else {
          event.preventDefault();
          props.contentChanged(queryUrl);
          props.runQuery();
        }
        break;

      case KeyCodes.tab:
        if (showSuggestions) {
          event.preventDefault();
          const selected = filteredSuggestions[activeSuggestion];
          appendSuggestionToUrl(selected);
        }
        break;

      case KeyCodes.up:
        event.preventDefault();
        if (showSuggestions) {
          let active = activeSuggestion - 1;
          if (activeSuggestion === 0) {
            active = filteredSuggestions.length - 1;
          }
          setActiveSuggestion(active);
        }
        break;

      case KeyCodes.down:
        event.preventDefault();
        if (showSuggestions) {
          let active = activeSuggestion + 1;
          if (activeSuggestion === filteredSuggestions.length - 1) {
            active = 0;
          }
          setActiveSuggestion(active);
        }
        break;

      case KeyCodes.escape:
        if (showSuggestions) {
          setShowSuggestions(false);
        }
        break;

      default:
        break;
    }

    const controlSpace = event.ctrlKey && event.keyCode === KeyCodes.space;
    const controlPeriod = event.ctrlKey && event.keyCode === KeyCodes.period;
    if (controlSpace || controlPeriod) {
      const targetValue = event.target.value;
      const lastSymbol = getLastSymbolInUrl(targetValue);
      const previousUserInput = targetValue.substring(0, lastSymbol.value + 1);
      if (lastSymbol.key === '/' || lastSymbol.key === '?') {
        setCompare(targetValue.replace(previousUserInput, ''));
        setUserInput(previousUserInput);
        requestForAutocompleteOptions(previousUserInput);
      } else {
        const filtered = getFilteredSuggestions('', suggestions);
        setSuggestions(filtered, targetValue.replace(previousUserInput, ''));
      }
    }
  };

  const displayLinkOptions = () => {
    const parametersWithVerb = getParametersWithVerb({ options: autoCompleteOptions!, sampleQuery });
    if (!parametersWithVerb) {
      return;
    }

    setSuggestions(parametersWithVerb.links);
  }

  const getQueryParameters = () => {
    const parametersWithVerb = getParametersWithVerb({ options: autoCompleteOptions!, sampleQuery });
    if (!parametersWithVerb) {
      return;
    }

    let filtered = parametersWithVerb.values.map((value: { name: any; }) => value.name);
    if (compare) {
      filtered = getFilteredSuggestions(compare, filtered);
    }

    setSuggestions(filtered);
  }

  const getParameterEnums = (url: string) => {
    const parametersWithVerb = getParametersWithVerb({ options: autoCompleteOptions!, sampleQuery });
    if (!parametersWithVerb) {
      return;
    }
    const param = url.split('$').pop()!.split('=')[0];
    const section = parametersWithVerb.values.find((k: { name: string; }) => {
      return k.name === `$${param}`;
    });

    if (section && section.items && section.items.length > 0) {
      setSuggestions(section.items);
    }
  }

  const setSuggestions = (suggestionList: string[], compareString?: string) => {
    const sortedSuggestions = sortSuggestions(suggestionList);
    const shouldShowSuggestions = suggestionList.length > 0;
    setFilteredSuggestions(sortedSuggestions);
    addSuggestions(sortedSuggestions);
    setShowSuggestions(shouldShowSuggestions);
    setCompare(compareString || '');
  }

  const sortSuggestions = (suggestionList: string[]): string[] => {
    return suggestionList.sort(dynamicSort(null, SortOrder.ASC));
  }

  const requestForAutocompleteOptions = (url: string) => {
    const signature = sanitizeQueryUrl(url);
    const { requestUrl, queryVersion } = parseSampleUrl(signature);
    if (GRAPH_API_VERSIONS.includes(queryVersion.toLowerCase())) {
      if (!requestUrl) {
        dispatch(fetchAutoCompleteOptions('', queryVersion));
      } else {
        if (!autoCompleteOptions || `${requestUrl}` !== autoCompleteOptions.url) {
          dispatch(fetchAutoCompleteOptions(requestUrl, queryVersion));
        } else {
          performLocalSearch(url);
        }
      }
    }
  }

  const performLocalSearch = (url: string) => {
    switch (getLastCharacterOf(url)) {
      case '/':
        displayLinkOptions();
        break;

      case '?':
        getQueryParameters();
        break;

      default:
        break;
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
    if (selected.startsWith('$')) {
      selected += '=';
    }
    const selectedSuggestion = cleanUpSelectedSuggestion(compare, userInput, selected);
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setUserInput(selectedSuggestion);
    setCompare('');
    setQueryUrl(selectedSuggestion);
    setIsMultiline(isOverflowing(selectedSuggestion))
    props.contentChanged(selectedSuggestion);
    setFocus();
    initialiseAutoComplete(selectedSuggestion);
    trackSuggestionSelectionEvent(selected);
  }

  const renderSuffix = () => {
    return <SuffixRenderer />;
  }

  const closeSuggestionDialog = (event: any) => {
    const { currentTarget, relatedTarget } = event;
    if (!currentTarget.contains(relatedTarget as Node) && showSuggestions) {
      setShowSuggestions(false);
    }
  }

  const getErrorMessage = (): string | JSX.Element | undefined => {
    if (!queryUrl) {
      return translateMessage('Missing url');
    }
    if (hasWhiteSpace(queryUrl)) {
      return translateMessage('Invalid whitespace in URL');
    }
    const { queryVersion } = parseSampleUrl(queryUrl)
    if (!GRAPH_API_VERSIONS.includes(queryVersion)) {
      return translateMessage('Invalid version in URL');
    }
    return '';
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
          componentRef={focusRef!}
          onRenderSuffix={(renderSuffix()) ? renderSuffix : undefined}
          ariaLabel={translateMessage('Query Sample Input')}
          role='textbox'
          errorMessage={getErrorMessage()}
        />
      </div>
      {showSuggestions && userInput && filteredSuggestions.length > 0 &&
        <SuggestionsList
          filteredSuggestions={filteredSuggestions}
          activeSuggestion={activeSuggestion}
          onClick={(e: any) => selectSuggestion(e)} />}
    </div>
  );
}

export default AutoComplete;