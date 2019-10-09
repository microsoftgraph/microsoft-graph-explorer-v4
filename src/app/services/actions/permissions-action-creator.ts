import { IAction } from '../../../types/action';
import { IRequestOptions } from '../../../types/request';

import { GET_CONSENT_ERROR, SCOPES_FETCH_ERROR,
  SCOPES_FETCH_PENDING, SCOPES_FETCH_SUCCESS } from '../redux-constants';
import { queryResponseError } from './error-action-creator';
import { authenticatedRequest, parseResponse, queryResponse } from './query-action-creator-util';

export function fetchScopesSuccess(response: object): IAction {
  return {
    type: SCOPES_FETCH_SUCCESS,
    response,
  };
}

export function fetchScopesError(response: object): IAction {
  return {
    type: SCOPES_FETCH_ERROR,
    response,
  };
}

export function fetchScopesPending(): any {
  return {
    type: SCOPES_FETCH_PENDING
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
    const query = getState().sampleQuery;
    const { sampleUrl, selectedVerb } = query;
    const urlObject: URL = new URL(sampleUrl);
    // remove the prefix i.e. beta or v1.0 and any possible extra whack character at the end'/'
    const requestUrl = urlObject.pathname.substr(5).replace(/\/$/, '');
    const permissionsUrl = 'https://graphexplorerapi.azurewebsites.net/api/GraphExplorerPermissions?requesturl=' +
      requestUrl + '&method=' + selectedVerb;

    const headers = {
      'Content-Type': 'application/json',
    };

    const options: IRequestOptions = { headers };
   // todo consider removing
    dispatch(fetchScopesPending());

    return fetch(permissionsUrl, options)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        dispatch(fetchScopesSuccess(res));
      })
      .catch(() => {
        const response = {
          statusText: 'Forbidden',
          status: '403',
        };
        return dispatch(fetchScopesError(response));
      });

  };
}

export function getConsent(): Function {
  return (dispatch: Function, getState: Function) => {
    const respHeaders: any = {};
    const query = getState().sampleQuery;
    const scopes = getState().scopes.data;

    return authenticatedRequest(dispatch, query, scopes).then(async (response: Response) => {

      if (response && response.ok) {
        const json = await parseResponse(response, respHeaders);
        return dispatch(
          queryResponse({
            body: json,
            headers: respHeaders
          }),
        );
      }
      return dispatch(queryResponseError({ response }));
    }).catch((error: any) => {
      const response = {
        statusText: error.code,
        status: error.message ? error.message : 'Consent was not granted',
      };
      return dispatch(getConsentError(response));
    });

  };
}
