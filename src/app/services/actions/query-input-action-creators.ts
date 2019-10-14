import { IAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
import { SELECT_VERSION_SUCCESS, SET_SAMPLE_QUERY_SUCCESS } from '../redux-constants';

export function setSampleQuery(response: IQuery): IAction {
  return {
    type: SET_SAMPLE_QUERY_SUCCESS,
    response,
  };
}

export function selectQueryVersion(response: IQuery): IAction {
  return {
    type: SELECT_VERSION_SUCCESS,
    response,
  };
}
