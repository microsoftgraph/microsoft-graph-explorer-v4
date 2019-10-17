import { IAction } from '../../../types/action';
import { FETCH_SCOPES_ERROR, FETCH_SCOPES_SUCCESS } from '../redux-constants';

const initialState = {
  pending: false,
  data: [],
  error: null
};

export function scopes(state = initialState, action: IAction): any {
  switch (action.type) {
    case FETCH_SCOPES_SUCCESS:
      return {
        ...state,
        pending: false,
        data: action.response
      };
    case FETCH_SCOPES_ERROR:
      return {
        ...state,
        pending: false,
        error: action.response
      };
    default:
      return state;
  }
}
