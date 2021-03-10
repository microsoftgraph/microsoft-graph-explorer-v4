import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { geLocale } from '../../../appLocale';
import { authenticationWrapper } from '../../../modules/authentication';
import { componentNames, errorTypes, telemetry } from '../../../telemetry';
import { IAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
import { IRequestOptions } from '../../../types/request';
import { sanitizeQueryUrl } from '../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../utils/sample-url-generation';
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
      let permissionsUrl = `${devxApi.baseUrl}/permissions`;

      let hasUrl = false; // whether permissions are for a specific url

      if (query) {
        const signature = sanitizeQueryUrl(query.sampleUrl);
        const { requestUrl, sampleUrl } = parseSampleUrl(signature);

        if (!sampleUrl) {
          throw new Error('url is invalid');
        }

        permissionsUrl = `${permissionsUrl}?requesturl=/${requestUrl}&method=${query.selectedVerb}`;
        hasUrl = true;
      }

      if (devxApi.parameters) {
        permissionsUrl = `${permissionsUrl}${query ? '&' : '?'}${devxApi.parameters}`;
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
        return dispatch(fetchScopesSuccess({
          hasUrl, scopes
        }));
      }
      throw (response);
    } catch (error) {
      telemetry.trackException(
        new Error(errorTypes.NETWORK_ERROR),
        SeverityLevel.Error,
        {
          ComponentName: componentNames.FETCH_PERMISSIONS_ACTION,
          Message: `${error}`
        });
      return dispatch(fetchScopesError(error));
    }
  };
}

export function consentToScopes(scopes: string[]): Function {
  return async (dispatch: Function) => {
    const authResponse = await authenticationWrapper.acquireNewAccessToken(scopes);
    if (authResponse && authResponse.accessToken) {
      dispatch(getAuthTokenSuccess(true));
      dispatch(getConsentedScopesSuccess(authResponse.scopes));
    }
  };
}
