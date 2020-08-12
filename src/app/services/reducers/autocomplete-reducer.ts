import { IAction, IApiResponse } from '../../../types/action';
import { AUTOCOMPLETE_FETCH_ERROR, AUTOCOMPLETE_FETCH_PENDING, AUTOCOMPLETE_FETCH_SUCCESS } from '../redux-constants';

const initialState: IApiResponse = {
  pending: false,
  data: [],
  error: null
};

export function autoComplete(state = initialState, action: IAction): IApiResponse {
  switch (action.type) {
    case AUTOCOMPLETE_FETCH_PENDING:
      return {
        ...state,
        pending: true
      };
    case AUTOCOMPLETE_FETCH_SUCCESS:
      return {
        ...state,
        pending: false,
        data: action.response
      };
    case AUTOCOMPLETE_FETCH_ERROR:
      return {
        pending: false,
        data: null,
        error: action.response
      };
    default:
      return state;
  }
}
