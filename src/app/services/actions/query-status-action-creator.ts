import { Dispatch } from 'redux';
import { AppAction } from '../../../types/action';
import { CLEAR_QUERY_STATUS, CLEAR_RESPONSE, QUERY_GRAPH_STATUS } from '../redux-constants';

export function setQueryResponseStatus(response: object): AppAction {
  return {
    type: QUERY_GRAPH_STATUS,
    response
  };
}

export function clearResponse(): AppAction {
  return {
    type: CLEAR_RESPONSE,
    response: null
  };
}


export function clearQueryStatus() {
  return (dispatch: Dispatch) => {
    dispatch({
      type: CLEAR_QUERY_STATUS
    });
  };
}

