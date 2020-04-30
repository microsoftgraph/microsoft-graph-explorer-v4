import { IAction } from '../../../types/action';
import { FETCH_SCOPES_ERROR, FETCH_SCOPES_PENDING, FETCH_SCOPES_SUCCESS } from '../redux-constants';

const initialState = {
  pending: false,
  data: [],
  error: null
};

export function scopes(state = initialState, action: IAction): any {
  switch (action.type) {
    case FETCH_SCOPES_SUCCESS:
      return {
        pending: false,
        data: action.response,
        error: null
      };
    case FETCH_SCOPES_ERROR:
      return {
        pending: false,
        error: action.response,
        data: []
      };
    case FETCH_SCOPES_PENDING:
      return {
        pending: true,
        data: [],
        error: null
      };
    default:
      return state;
  }
}
