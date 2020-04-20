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

export function fetchAutoCompleteOptions(url: string): Function {
  return async (dispatch: Function, getState: Function) => {
    const devxApi = getState().devxApi;
    const sampleQuery = getState().sampleQuery;
    const headers = {
      'Content-Type': 'application/json',
    };

    let permissionsUrl = `${devxApi}/openapi`;
    permissionsUrl = `${permissionsUrl}?url=/${url}&style=geautocomplete&format=json`;

    const options: IRequestOptions = { headers };

    dispatch(fetchAutocompletePending());

    try {
      const response = await fetch(permissionsUrl, options);
      if (response.ok) {
        const autoCompleteOptions = await response.json();
        const params = {
          options: autoCompleteOptions,
          url,
          verb: sampleQuery.selectedVerb.toLowerCase()
        };
        const reduced = getReducedVersion(params);

        return dispatch(fetchAutocompleteSuccess(reduced));
      }

      throw (response);

    } catch (error) {
      return dispatch(fetchAutocompleteError(error));
    }
  };
}
function getReducedVersion(params: any) {
  const { options, url, verb } = params;
  const { paths } = options;
  try {
    const parameters: any[] = [];
    let rootPath = url;
    if (url.includes('me/drive')) {
      rootPath = url.substring(3);
    }
    const root = paths[`/${rootPath}`];
    const verbContent = root[`${verb}`];
    const queryParams = verbContent.parameters;
    if (queryParams.length > 0) {
      queryParams.forEach((param: any) => {
        if (param.name) {
          const newLocal = {
            name: param.name,
            items: param.items.enum || null
          };
          parameters.push(newLocal);
        }
      });
    }
    const resp = { url, parameters, verb };
    return resp;

  } catch (error) {
    return { error };
  }
}

