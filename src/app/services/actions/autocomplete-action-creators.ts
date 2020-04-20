import { IAction } from '../../../types/action';
import { IRequestOptions } from '../../../types/request';
import { AUTOCOMPLETE_FETCH_ERROR, AUTOCOMPLETE_FETCH_PENDING, AUTOCOMPLETE_FETCH_SUCCESS } from '../redux-constants';

export function fetchAutocompleteSuccess(response: object): IAction {
  return {
    type: AUTOCOMPLETE_FETCH_SUCCESS,
    response,
  };
}

export function fetchAutocompleteError(response: object): IAction {
  return {
    type: AUTOCOMPLETE_FETCH_ERROR,
    response,
  };
}

export function fetchAutocompletePending(): any {
  return {
    type: AUTOCOMPLETE_FETCH_PENDING
  };
}

export function fetchAutocompleteOptions(url: string): Function {
  return async (dispatch: Function, getState: Function) => {
    const devxApi = getState().devxApi;

    let permissionsUrl = `${devxApi}/openapi`;

    const headers = {
      'Content-Type': 'application/json',
    };

    permissionsUrl += url + '&style=geautocomplete&format=json';

    const options: IRequestOptions = { headers };

    dispatch(fetchAutocompletePending());

    return fetch(permissionsUrl, options)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        dispatch(fetchAutocompleteSuccess(res.paths));
        return res;
      })
      .catch(error => {
        dispatch(fetchAutocompleteError(error));
      });

  };
}
