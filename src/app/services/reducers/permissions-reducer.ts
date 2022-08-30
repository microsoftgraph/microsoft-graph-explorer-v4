import { IAction } from '../../../types/action';
import { IPermissionsResponse, IScopes, IUnconsent } from '../../../types/permissions';
import {
  FETCH_SCOPES_ERROR, FETCH_URL_SCOPES_PENDING, FETCH_FULL_SCOPES_SUCCESS,
  FETCH_URL_SCOPES_SUCCESS, FETCH_FULL_SCOPES_PENDING,
  REVOKE_PERMISSION_PENDING, REVOKE_PERMISSION_SUCCESS, REVOKE_PERMISSION_ERROR
} from '../redux-constants';

const initialState: IScopes = {
  pending: {
    isSpecificPermissions: false,
    isFullPermissions: false
  },
  data: {
    specificPermissions: [],
    fullPermissions: []
  },
  error: null
};

export function scopes(state: IScopes = initialState, action: IAction): any {
  switch (action.type) {
    case FETCH_FULL_SCOPES_SUCCESS:
      let response: IPermissionsResponse = { ...action.response as IPermissionsResponse };
      return {
        pending: { ...state.pending, isFullPermissions: false },
        data: { ...state.data, fullPermissions: response.scopes.fullPermissions },
        error: null
      };
    case FETCH_URL_SCOPES_SUCCESS:
      response = { ...action.response as IPermissionsResponse };
      return {
        pending: { ...state.pending, isSpecificPermissions: false },
        data: { ...state.data, specificPermissions: response.scopes.specificPermissions },
        error: null
      }
    case FETCH_SCOPES_ERROR:
      return {
        pending: { isFullPermissions: false, isSpecificPermissions: false },
        error: action.response,
        data: {}
      };
    case FETCH_URL_SCOPES_PENDING:
      return {
        pending: { ...state.pending, isSpecificPermissions: true },
        data: state.data,
        error: null
      };
    case FETCH_FULL_SCOPES_PENDING:
      return {
        pending: { ...state.pending, isFullPermissions: true },
        data: state.data,
        error: null
      };
    default:
      return state;
  }
}

const unconsentInitialState: IUnconsent = {
  pending: false,
  error: null,
  data: []
}

export function unconsentingScopes(state: IUnconsent = unconsentInitialState, action: IAction): any {
  switch (action.type) {
    case REVOKE_PERMISSION_PENDING:
      return {
        pending: action.response,
        error: null,
        data: []
      }
    case REVOKE_PERMISSION_SUCCESS:
      return {
        pending: false,
        error: null,
        data: action.response
      }

    case REVOKE_PERMISSION_ERROR:
      return {
        pending: false,
        error: action.response,
        data: []
      }
    default:
      return state;
  }
}
