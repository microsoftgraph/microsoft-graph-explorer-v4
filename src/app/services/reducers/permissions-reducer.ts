import { IAction } from '../../../types/action';
import { SCOPES_FETCH_ERROR, SCOPES_FETCH_PENDING, SCOPES_FETCH_SUCCESS } from '../redux-constants';

const initialState = {
  pending: false,
  scopes: [],
  error: null
};

export function scopes(state = initialState, action: IAction): any {
  switch (action.type) {
    case SCOPES_FETCH_PENDING:
      return {
        ...state,
        pending: true
      };
    case SCOPES_FETCH_SUCCESS:
      return {
        ...state,
        pending: false,
        scopes: action.response
      };
    case SCOPES_FETCH_ERROR:
      return {
        ...state,
        pending: false,
        scopes,
        error: action.response
      };
    default:
      return state;
  }
}
