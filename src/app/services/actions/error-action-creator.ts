import { Dispatch } from 'redux';
import { IAction } from '../../../types/action';
import { CLEAR_QUERY_ERROR, CLEAR_RESPONSE, QUERY_GRAPH_ERROR } from '../redux-constants';

export function queryResponseError(response: object): IAction {
  return {
    type: QUERY_GRAPH_ERROR,
    response,
  };
}

export function clearResponse() {
  return {
    type: CLEAR_RESPONSE
  };
}


export function clearQueryError(): Function {
  return (dispatch: Dispatch) => {
    dispatch({
      type: CLEAR_QUERY_ERROR
    });
  };
}

