import { AppAction } from '../../../types/action';
import { IPermissionsResponse, IScopes } from '../../../types/permissions';
import {
  FETCH_SCOPES_ERROR, FETCH_URL_SCOPES_PENDING, FETCH_FULL_SCOPES_SUCCESS,
  FETCH_URL_SCOPES_SUCCESS, FETCH_FULL_SCOPES_PENDING, GET_ALL_PRINCIPAL_GRANTS_SUCCESS,
  REVOKE_SCOPES_PENDING, REVOKE_SCOPES_ERROR, REVOKE_SCOPES_SUCCESS, GET_ALL_PRINCIPAL_GRANTS_PENDING,
  GET_ALL_PRINCIPAL_GRANTS_ERROR
} from '../redux-constants';

const initialState: IScopes = {
  pending: {
    isSpecificPermissions: false,
    isFullPermissions: false,
    isTenantWidePermissionsGrant: false,
    isRevokePermissions: false
  },
  data: {
    specificPermissions: [],
    fullPermissions: [],
    tenantWidePermissionsGrant: []
  },
  error: null
};

export function scopes(state: IScopes = initialState, action: AppAction): any {
  let response: IPermissionsResponse;
  switch (action.type) {
    case FETCH_FULL_SCOPES_SUCCESS:
      response = { ...action.response as IPermissionsResponse };
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
    case GET_ALL_PRINCIPAL_GRANTS_PENDING:
      return {
        pending: { ...state.pending, isTenantWidePermissionsGrant: action.response },
        data: state.data,
        error: null
      }
    case GET_ALL_PRINCIPAL_GRANTS_SUCCESS:
      return {
        pending: state.pending,
        data: { ...state.data, tenantWidePermissionsGrant: action.response },
        error: null
      }
    case GET_ALL_PRINCIPAL_GRANTS_ERROR:
      return {
        pending: state.pending,
        data: state.data,
        error: action.response
      }
    case REVOKE_SCOPES_PENDING:
      return {
        pending: { ...state.pending, isRevokePermissions: true },
        data: state.data,
        error: null
      }
    case REVOKE_SCOPES_ERROR:
      return {
        pending: { ...state.pending, isRevokePermissions: false },
        data: state.data,
        error: 'error'
      }
    case REVOKE_SCOPES_SUCCESS:
      return {
        pending: { ...state.pending, isRevokePermissions: false },
        data: state.data,
        error: null
      }
    default:
      return state;
  }
}
