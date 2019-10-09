import { IAction } from '../../../types/action';
import { IRequestOptions } from '../../../types/request';

import { SCOPES_FETCH_ERROR,  SCOPES_FETCH_PENDING,  SCOPES_FETCH_SUCCESS } from '../redux-constants';

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

  export function fetchScopes(requestUrl: string, method: string): Function {
    return async (dispatch: Function) => {
      const permissionsUrl = 'https://graphexplorerapi.azurewebsites.net/api/GraphExplorerPermissions?requesturl=' +
       requestUrl + '&method=' + method;

      const headers = {
        'Content-Type': 'application/json',
      };

      const options: IRequestOptions = { headers };

      dispatch(fetchScopesPending());

      return fetch(permissionsUrl, options)
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            throw (res.error);
          }
          dispatch(fetchScopesSuccess(res));
          return res.products;
        })
        .catch(error => {
          dispatch(fetchScopesError(error));
        });

    };
  }