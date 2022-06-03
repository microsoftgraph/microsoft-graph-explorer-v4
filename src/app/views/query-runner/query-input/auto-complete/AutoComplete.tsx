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
import { parseSampleUrl, removeExtraSlashesFromUrl } from '../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../utils/translate-messages';
import { queryInputStyles } from '../QueryInput.styles';
import {
  cleanUpSelectedSuggestion, getErrorMessage, getFilteredSuggestions, getLastCharacterOf,
  getLastSymbolInUrl, getParametersWithVerb
} from './auto-complete.util';
import SuffixRenderer from './suffix/SuffixRenderer';
import SuggestionsList from './suggestion-list/SuggestionsList';

const signs = {
  SLASH: '/',
  QUESTION_MARK: '?',
  EQUALS: '=',
  COMMA: ',',
  AMPERSAND: '&',
  DOLLAR: '$'
}

const AutoComplete = (props: IAutoCompleteProps) => {

  const dispatch = useDispatch();
  const focusRef = useRef<any>(null);

  let element: HTMLDivElement | null | undefined = null;

  const { sampleQuery, autoComplete: { data: autoCompleteOptions } } = useSelector(
    (state: IRootState) => state
  );

  const [isMultiline, setIsMultiline] = useState<boolean>(false);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(0);
  const [suggestions, addSuggestions] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>(sampleQuery.sampleUrl);
  const [queryUrl, setQueryUrl] = useState<string>(sampleQuery.sampleUrl);
  const [shouldShowSuggestions, setShouldShowSuggestions] = useState<boolean>(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setUserInput(sampleQuery.sampleUrl);
    setQueryUrl(sampleQuery.sampleUrl);
  }, [sampleQuery])

  useEffect(() => {
    if (autoCompleteOptions) {
      displayAutoCompleteSuggestions(userInput);
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

    if (shouldShowSuggestions && suggestions.length) {
      let compareString = targetValue.replace(previousUserInput, '');
      compareString = (searchText) ? searchText + compareString : compareString;
      setFilteredSuggestions(getFilteredSuggestions(compareString, suggestions));
      setSearchText(compareString);
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
      case `${signs.SLASH}`:
      case `${signs.QUESTION_MARK}`:
        requestForAutocompleteOptions(url);
        break;

      case `${signs.EQUALS}`:

        if (url.includes(`${signs.QUESTION_MARK}${signs.DOLLAR}`)) {
          getParameterEnums(url);
        }

        break;

      case `${signs.COMMA}`:
        getParameterEnums(url);
        break;

      case `${signs.AMPERSAND}`:
        displayQueryParameters();
        break;

      default:

        break;
    }
  }

  const onKeyDown = (event: any) => {
    switch (event.keyCode) {
      case KeyCodes.enter:
        if (shouldShowSuggestions) {
          const selected = filteredSuggestions[activeSuggestion];
          appendSuggestionToUrl(selected);
        } else {
          event.preventDefault();
          props.contentChanged(queryUrl);
          props.runQuery();
        }
        break;

      case KeyCodes.tab:
        if (shouldShowSuggestions) {
          event.preventDefault();
          const selected = filteredSuggestions[activeSuggestion];
          appendSuggestionToUrl(selected);
        }
        break;

      case KeyCodes.up:
        event.preventDefault();
        if (shouldShowSuggestions) {
          let active = activeSuggestion - 1;
          if (activeSuggestion === 0) {
            active = filteredSuggestions.length - 1;
          }
          setActiveSuggestion(active);
        }
        break;

      case KeyCodes.down:
        event.preventDefault();
        if (shouldShowSuggestions) {
          let active = activeSuggestion + 1;
          if (activeSuggestion === filteredSuggestions.length - 1) {
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

    const controlSpace = event.ctrlKey && event.keyCode === KeyCodes.space;
    const controlPeriod = event.ctrlKey && event.keyCode === KeyCodes.period;
    if (controlSpace || controlPeriod) {
      const targetValue = event.target.value;
      const lastSymbol = getLastSymbolInUrl(targetValue);
      const previousUserInput = targetValue.substring(0, lastSymbol.value + 1);
      if (lastSymbol.key === signs.SLASH || lastSymbol.key === signs.QUESTION_MARK) {
        setSearchText(targetValue.replace(previousUserInput, ''));
        setUserInput(previousUserInput);
        requestForAutocompleteOptions(previousUserInput);
      } else {
        const filtered = getFilteredSuggestions('', suggestions);
        displaySuggestions(filtered, targetValue.replace(previousUserInput, ''));
      }
    }
  };

  const displayLinkOptions = () => {
    const parametersWithVerb = getParametersWithVerb({ options: autoCompleteOptions!, sampleQuery });
    if (!parametersWithVerb) {
      return;
    }

    displaySuggestions(parametersWithVerb.links);
  }

  const displayQueryParameters = () => {
    const parametersWithVerb = getParametersWithVerb({ options: autoCompleteOptions!, sampleQuery });
    if (!parametersWithVerb) {
      return;
    }

    let filtered = parametersWithVerb.values.map((value: { name: any; }) => value.name);
    if (searchText) {
      filtered = getFilteredSuggestions(searchText, filtered);
    }

    displaySuggestions(filtered);
  }

  const getParameterEnums = (url: string) => {
    const parametersWithVerb = getParametersWithVerb({ options: autoCompleteOptions!, sampleQuery });
    if (!parametersWithVerb) {
      return;
    }
    const param = url.split(signs.DOLLAR).pop()!.split(signs.EQUALS)[0];
    const section = parametersWithVerb.values.find((k: { name: string; }) => {
      return k.name === `${signs.DOLLAR}${param}`;
    });

    if (section && section.items && section.items.length > 0) {
      displaySuggestions(section.items);
    }
  }

  const displaySuggestions = (suggestionList: string[], compareString?: string) => {
    suggestionList.sort(dynamicSort(null, SortOrder.ASC));
    setFilteredSuggestions(suggestionList);
    addSuggestions(suggestionList);
    setShouldShowSuggestions(suggestionList.length > 0);
    setSearchText(compareString || '');
  }

  const requestForAutocompleteOptions = (url: string) => {
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
      displayAutoCompleteSuggestions(url)
    }
    dispatch(fetchAutoCompleteOptions(requestUrl, queryVersion));
  }

  const displayAutoCompleteSuggestions = (url: string) => {
    const lastUrlCharacter = getLastCharacterOf(url);
    if (lastUrlCharacter === signs.SLASH) {
      displayLinkOptions();
    }

    if (lastUrlCharacter === signs.QUESTION_MARK) {
      displayQueryParameters();
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
    if (selected.startsWith(signs.DOLLAR)) {
      selected += signs.EQUALS;
    }
    const selectedSuggestion = cleanUpSelectedSuggestion(searchText, userInput, selected);
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShouldShowSuggestions(false);
    setUserInput(selectedSuggestion);
    setSearchText('');
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
    if (!currentTarget.contains(relatedTarget as Node) && shouldShowSuggestions) {
      setShouldShowSuggestions(false);
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
          componentRef={focusRef!}
          onRenderSuffix={(renderSuffix()) ? renderSuffix : undefined}
          ariaLabel={translateMessage('Query Sample Input')}
          role='textbox'
          errorMessage={getErrorMessage(queryUrl)}
        />
      </div>
      {shouldShowSuggestions && userInput && filteredSuggestions.length > 0 &&
        <SuggestionsList
          filteredSuggestions={filteredSuggestions}
          activeSuggestion={activeSuggestion}
          onClick={(e: any) => selectSuggestion(e)} />}
    </div>
  );
}

export default AutoComplete;