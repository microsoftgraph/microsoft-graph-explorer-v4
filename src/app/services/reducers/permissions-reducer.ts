import { IAction } from '../../../types/action';
import { IPermissionsResponse, IScopes } from '../../../types/permissions';
import {
  FETCH_SCOPES_ERROR, FETCH_SCOPES_PENDING, FETCH_FULL_SCOPES_SUCCESS,
  FETCH_URL_SCOPES_SUCCESS
} from '../redux-constants';

const initialState: IScopes = {
  pending: false,
  data: {
    tabPermissions: [],
    panelPermissions: []
  },
  hasUrl: false,
  error: null
};

export function scopes(state: IScopes = initialState, action: IAction): any {
  switch (action.type) {
    case FETCH_FULL_SCOPES_SUCCESS:
      let response: IPermissionsResponse = { ...action.response as IPermissionsResponse };
      return {
        pending: false,
        data: { ...state.data, panelPermissions: response.scopes.panelPermissions },
        hasUrl: response.hasUrl,
        error: null
      };
    case FETCH_URL_SCOPES_SUCCESS:
      response = { ...action.response as IPermissionsResponse };
      return {
        pending: false,
        data: { ...state.data, tabPermissions: response.scopes.tabPermissions },
        hasUrl: response.hasUrl,
        error: null
      }
    case FETCH_SCOPES_ERROR:
      return {
        pending: false,
        error: action.response,
        hasUrl: false,
        data: {}
      };
    case FETCH_SCOPES_PENDING:
      return {
        pending: true,
        data: state.data,
        error: null,
        hasUrl: false
      };
    default:
      return state;
  }
}
