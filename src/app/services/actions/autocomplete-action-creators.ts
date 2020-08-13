import { IAction } from '../../../types/action';
import { IOpenApiParseContent, IOpenApiResponse } from '../../../types/open-api';
import { IRequestOptions } from '../../../types/request';
import { parseOpenApiResponse } from '../../utils/open-api-parser';
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
    const openApiUrl = `${devxApi}/openapi?url=/${url}&style=geautocomplete`;
    const options: IRequestOptions = { headers };

    dispatch(fetchAutocompletePending());

    try {
      const response = await fetch(openApiUrl, options);
      if (response.ok) {
        const openApiResponse: IOpenApiResponse = await response.json();
        const content: IOpenApiParseContent = {
          response: openApiResponse,
          url,
          verb: sampleQuery.selectedVerb.toLowerCase()
        };
        const parsedResponse = parseOpenApiResponse(content);
        return dispatch(fetchAutocompleteSuccess(parsedResponse));
      }
      throw new Error(response.statusText);
    } catch (error) {
      return dispatch(fetchAutocompleteError(error));
    }
  };
}
