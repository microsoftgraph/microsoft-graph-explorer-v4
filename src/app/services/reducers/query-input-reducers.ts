import { IAction } from '../../../types/action';
import { SET_SAMPLE_QUERY_SUCCESS } from '../redux-constants';

export function sampleQuery(state = {}, action: IAction): any {
  switch (action.type) {
    case SET_SAMPLE_QUERY_SUCCESS:
      return action.response;
    default:
      return state;
  }
}
