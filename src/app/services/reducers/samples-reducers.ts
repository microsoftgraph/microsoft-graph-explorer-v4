import { AppAction } from '../../../types/action';
import { queries } from '../../views/sidebar/sample-queries/queries';
import { SAMPLES_FETCH_ERROR, SAMPLES_FETCH_PENDING, SAMPLES_FETCH_SUCCESS } from '../redux-constants';

const initialState = {
  pending: false,
  queries: [],
  error: null
};

export function samples(state = initialState, action: AppAction): any {
  switch (action.type) {
    case SAMPLES_FETCH_PENDING:
      return {
        ...state,
        pending: true
      };
    case SAMPLES_FETCH_SUCCESS:
      return {
        ...state,
        pending: false,
        queries: action.response
      };
    case SAMPLES_FETCH_ERROR:
      return {
        ...state,
        pending: false,
        queries,
        error: action.response
      };
    default:
      return state;
  }
}
