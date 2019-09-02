import { IAction } from '../../../types/action';
import { SAMPLES_FETCH_ERROR, SAMPLES_FETCH_SUCCESS } from '../redux-constants';

export function sampleQueries(state = [], action: IAction): any {
  switch (action.type) {
    case SAMPLES_FETCH_SUCCESS:
      return action.response;
    case SAMPLES_FETCH_ERROR:
      return state;
    default:
      return state;
  }
}
