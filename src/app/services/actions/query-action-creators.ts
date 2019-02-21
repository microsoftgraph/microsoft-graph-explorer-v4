import { fetch } from 'cross-fetch';

import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../constants';

interface IAction {
  type: string;
  response: string;
}

function queryResponse(response: string): IAction {
  return {
    type: QUERY_GRAPH_SUCCESS,
    response,
  };
}

function queryResponseError(response: string): IAction {
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
