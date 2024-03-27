import { SignContext, suggestions } from '../../../modules/suggestions';
import { AppAction } from '../../../types/action';
import {
  AUTOCOMPLETE_FETCH_ERROR,
  AUTOCOMPLETE_FETCH_PENDING,
  AUTOCOMPLETE_FETCH_SUCCESS
} from '../redux-constants';

export function fetchAutocompleteSuccess(response: object): AppAction {
  return {
    type: AUTOCOMPLETE_FETCH_SUCCESS,
    response
  };
}

export function fetchAutocompleteError(response: object): AppAction {
  return {
    type: AUTOCOMPLETE_FETCH_ERROR,
    response
  };
}

export function fetchAutocompletePending(): AppAction {
  return {
    type: AUTOCOMPLETE_FETCH_PENDING,
    response: null
  };
}

export function fetchAutoCompleteOptions(url: string, version: string, context: SignContext = 'paths') {
  return async (dispatch: Function, getState: Function) => {
    const devxApiUrl = getState().devxApi.baseUrl;
    const resources = Object.keys(getState().resources.data).length > 0 ? getState().resources.data[version] : [];
    dispatch(fetchAutocompletePending());
    const autoOptions = await suggestions.getSuggestions(
      url,
      devxApiUrl,
      version,
      context,
      resources
    );
    if (autoOptions) {
      return dispatch(fetchAutocompleteSuccess(autoOptions));
    }
    return dispatch(fetchAutocompleteError({}));
  };
}
