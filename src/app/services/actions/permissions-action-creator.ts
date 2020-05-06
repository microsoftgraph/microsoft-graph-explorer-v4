import { geLocale } from '../../../appLocale';
import { IAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
import { IRequestOptions } from '../../../types/request';
import { parseSampleUrl } from '../../utils/sample-url-generation';
import { acquireNewAccessToken } from '../graph-client/msal-service';
import { FETCH_SCOPES_ERROR, FETCH_SCOPES_PENDING, FETCH_SCOPES_SUCCESS } from '../redux-constants';
import { getAuthTokenSuccess, getConsentedScopesSuccess } from './auth-action-creators';

export function fetchScopesSuccess(response: object): IAction {
  return {
    type: FETCH_SCOPES_SUCCESS,
    response,
  };
}

export function fetchScopesPending(): any {
  return {
    type: FETCH_SCOPES_PENDING,
  };
}

export function fetchScopesError(response: object): IAction {
  return {
    type: FETCH_SCOPES_ERROR,
    response,
  };
}

export function fetchScopes(query?: IQuery): Function {
  return async (dispatch: Function, getState: Function) => {
    try {
      const { devxApi } = getState();
      let permissionsUrl = `${devxApi}/permissions`;

      if (query) {
        const { requestUrl, sampleUrl } = parseSampleUrl(query.sampleUrl);

        if (!sampleUrl) {
          throw new Error('url is invalid');
        }

        permissionsUrl = `${permissionsUrl}?requesturl=/${requestUrl}&method=${query.selectedVerb}`;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Accept-Language': geLocale
      };

      const options: IRequestOptions = { headers };

      dispatch(fetchScopesPending());

      const response = await fetch(permissionsUrl, options);
      if (response.ok) {
        const scopes = await response.json();
        return dispatch(fetchScopesSuccess(scopes));
      }
      throw (response);
    } catch (error) {
      return dispatch(fetchScopesError(error));
    }
  };
}

export function consentToScopes(scopes: string[]): Function {
  return async (dispatch: Function) => {
      const authResponse = await acquireNewAccessToken(scopes);
      if (authResponse && authResponse.accessToken) {
        dispatch(getAuthTokenSuccess(authResponse.accessToken));
        dispatch(getConsentedScopesSuccess(authResponse.scopes));
      }
  };
}
