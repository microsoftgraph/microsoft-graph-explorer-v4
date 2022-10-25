import { AppAction } from '../../../types/action';
import { IAutocompleteResponse } from '../../../types/auto-complete';
import { AUTOCOMPLETE_FETCH_ERROR, AUTOCOMPLETE_FETCH_PENDING, AUTOCOMPLETE_FETCH_SUCCESS } from '../redux-constants';

const initialState: IAutocompleteResponse = {
  pending: false,
  data: null,
  error: null
};

export function autoComplete(state = initialState, action: AppAction): IAutocompleteResponse {
  switch (action.type) {
    case AUTOCOMPLETE_FETCH_PENDING:
      return {
        error: null,
        data: null,
        pending: true
      };
    case AUTOCOMPLETE_FETCH_SUCCESS:
      return {
        pending: false,
        data: action.response,
        error: null
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
