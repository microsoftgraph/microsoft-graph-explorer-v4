import { Dispatch } from 'redux';
import { IAction } from '../../../types/action';
import { CLEAR_QUERY_STATUS, CLEAR_RESPONSE, QUERY_GRAPH_STATUS } from '../redux-constants';

export function setQueryResponseStatus(response: object): IAction {
  return {
    type: QUERY_GRAPH_STATUS,
    response,
  };
}

export function clearResponse() {
  return {
    type: CLEAR_RESPONSE
  };
}


export function clearQueryStatus(): Function {
  return (dispatch: Dispatch) => {
    dispatch({
      type: CLEAR_QUERY_STATUS
    });
  };
}

