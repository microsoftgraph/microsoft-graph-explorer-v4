import { IAction } from '../../../types/action';
import { IPermissionsResponse, IScopes } from '../../../types/permissions';
import {
  FETCH_SCOPES_ERROR, FETCH_URL_SCOPES_PENDING, FETCH_FULL_SCOPES_SUCCESS,
  FETCH_URL_SCOPES_SUCCESS, FETCH_FULL_SCOPES_PENDING, GET_ALL_PRINCIPAL_GRANTS_SUCCESS
} from '../redux-constants';

const initialState: IScopes = {
  pending: {
    isSpecificPermissions: false,
    isFullPermissions: false,
    isAllPrincipalPermissions: false
  },
  data: {
    specificPermissions: [],
    fullPermissions: [],
    allPrincipalPermissions: []
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
    case GET_ALL_PRINCIPAL_GRANTS_SUCCESS:
      return {
        pending: { ...state.pending, isAllPrincipalPermissions: false },
        data: { ...state.data, allPrincipalPermissions: action.response },
        error: null
      }
    default:
      return state;
  }
}
