import { SignContext, suggestions } from '../../../modules/suggestions';
import { IAction } from '../../../types/action';
import {
  AUTOCOMPLETE_FETCH_ERROR,
  AUTOCOMPLETE_FETCH_PENDING,
  AUTOCOMPLETE_FETCH_SUCCESS
} from '../redux-constants';

export function fetchAutocompleteSuccess(response: object): IAction {
  return {
    type: AUTOCOMPLETE_FETCH_SUCCESS,
    response
  };
}

export function fetchAutocompleteError(response: object): IAction {
  return {
    type: AUTOCOMPLETE_FETCH_ERROR,
    response
  };
}

export function fetchAutocompletePending(): any {
  return {
    type: AUTOCOMPLETE_FETCH_PENDING
  };
}

export function fetchAutoCompleteOptions(
  url: string,
  version: string,
  context: SignContext = 'paths'
): Function {
  return async (dispatch: Function, getState: Function) => {
    const devxApiUrl = getState().devxApi.baseUrl;
    const resources = getState().resources.data;
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
