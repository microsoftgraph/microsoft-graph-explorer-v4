import { IAction } from '../../../types/action';
import { IRequestOptions } from '../../../types/request';

import { FETCH_SCOPES_ERROR, FETCH_SCOPES_SUCCESS, GET_CONSENT_ERROR } from '../redux-constants';
import { authenticatedRequest, parseResponse, queryResponse } from './query-action-creator-util';

export function fetchScopesSuccess(response: object): IAction {
  return {
    type: FETCH_SCOPES_SUCCESS,
    response,
  };
}

export function fetchScopesError(response: object): IAction {
  return {
    type: FETCH_SCOPES_ERROR,
    response,
  };
}

export function getConsentError(response: object): IAction {
  return {
    type: GET_CONSENT_ERROR,
    response,
  };
}

export function fetchScopes(): Function {
  return async (dispatch: Function, getState: Function) => {
    const { sampleQuery: { sampleUrl, selectedVerb } } = getState();
    const urlObject: URL = new URL(sampleUrl);
    const createdAt = new Date().toISOString();
    // remove the prefix i.e. beta or v1.0 and any possible extra '/' character at the end
    const requestUrl = urlObject.pathname.substr(5).replace(/\/$/, '');
    const permissionsUrl = 'https://graphexplorerapi.azurewebsites.net/api/GraphExplorerPermissions?requesturl=' +
      requestUrl + '&method=' + selectedVerb;

    const headers = {
      'Content-Type': 'application/json',
    };

    const options: IRequestOptions = { headers };

    return fetch(permissionsUrl, options)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        dispatch(fetchScopesSuccess(res));
      })
      .catch(() => {
        const duration = (new Date()).getTime() - new Date(createdAt).getTime();
        const response = {
          /* Return 'Forbidden' regardless of error, as this was a
           permission-centric operation with regards to user context */
          statusText: 'Forbidden',
          status: '403',
          duration
        };
        return dispatch(fetchScopesError(response));
      });

  };
}

export function getConsent(): Function {
  return async(dispatch: Function, getState: Function) => {
    const respHeaders: any = {};
    const {sampleQuery: query} = getState();
    const {scopes: {data: scopes} } = getState();

    for (let num = 0; num < scopes.length; num++) {

      const scope: string[] = [];
      scope.push(scopes[num].value);

      try {
        const response = await authenticatedRequest(dispatch, query, scope);
        if (response && response.ok) {
          const json = await parseResponse(response, respHeaders);
          return dispatch(
            queryResponse({
              body: json,
              headers: respHeaders
            }),
          );
        }
        if (num === scopes.length - 1) {
          // All scopes have been consented to with no success
          return dispatch(getConsentError(response));
        }
      }
      catch (error) {
        const errorResponse = {
          statusText: error.code,
          status: error.message ? error.message : 'Consent was not granted',
        };
        return dispatch(getConsentError(errorResponse));
    }
  }
  };
}
