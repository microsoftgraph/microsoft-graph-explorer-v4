import { IAction } from '../../../types/action';
import { SELECT_VERSION_SUCCESS, SET_SAMPLE_QUERY_SUCCESS } from '../redux-constants';

export function sampleQuery(state = {}, action: IAction): any {
  switch (action.type) {
    case SET_SAMPLE_QUERY_SUCCESS:
      return action.response;
    default:
      return state;
  }
}

export function selectedVersion(state = {}, action: IAction): any {
  switch (action.type) {
    case SELECT_VERSION_SUCCESS:
      return action.response;
    default:
      return state;
  }
}