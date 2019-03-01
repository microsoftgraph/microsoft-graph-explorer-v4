import { IAction } from '../../../types/action';
import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../constants';

export function queryResponse(response: string): IAction {
  return {
    type: QUERY_GRAPH_SUCCESS,
    response,
  };
}

export function queryResponseError(response: string): IAction {
  return {
    type: QUERY_GRAPH_ERROR,
    response,
  };
}

export function runQuery(url: string): Function {
  const headers = { Authorization: 'Bearer {token:https://graph.microsoft.com/}' };

  return (dispatch: Function) => {
    return fetch(`https://proxy.apisandbox.msdn.microsoft.com/svc?url=${url}`, { headers })
      .then((response) => response.json(), (error) => queryResponseError(error))
      .then((json) => dispatch(queryResponse(json)));
  };
}
