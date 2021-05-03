import { IAction } from '../../../types/action';
import { IPermissionsResponse, IScopes } from '../../../types/permissions';
import { FETCH_SCOPES_ERROR, FETCH_SCOPES_PENDING, FETCH_SCOPES_SUCCESS } from '../redux-constants';

const initialState: IScopes = {
  pending: false,
  data: [],
  hasUrl: false,
  error: null
};

export function scopes(state: IScopes = initialState, action: IAction): any {
  switch (action.type) {
    case FETCH_SCOPES_SUCCESS:
      const response: IPermissionsResponse = { ...action.response as IPermissionsResponse };
      return {
        pending: false,
        data: response.scopes,
        hasUrl: response.hasUrl,
        error: null
      };
    case FETCH_SCOPES_ERROR:
      return {
        pending: false,
        error: action.response,
        hasUrl: false,
        data: []
      };
    case FETCH_SCOPES_PENDING:
      return {
        pending: true,
        data: [],
        error: null,
        hasUrl: false
      };
    default:
      return state;
  }
}
