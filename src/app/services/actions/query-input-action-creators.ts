import { AppAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
import { SET_SAMPLE_QUERY_SUCCESS } from '../redux-constants';

export function setSampleQuery(response: IQuery): AppAction {
  return {
    type: SET_SAMPLE_QUERY_SUCCESS,
    response
  };
}
