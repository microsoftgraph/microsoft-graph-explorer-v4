import { Dispatch } from 'redux';
import { IAction } from '../../../types/action';
import { CLEAR_QUERY_ERROR, QUERY_GRAPH_ERROR } from '../redux-constants';

export function queryResponseError(response: object): IAction {
  // Avoids collecting telemetry in a test environment
  const NODE_ENV = process.env.NODE_ENV;
  if (NODE_ENV !== 'test') {
    (window as any).appInsights.trackEvent('Error', response);
  }

  return {
    type: QUERY_GRAPH_ERROR,
    response,
  };
}

export function clearQueryError(): Function {
  return (dispatch: Dispatch) => {
    dispatch({
      type: CLEAR_QUERY_ERROR
    });
  };
}
