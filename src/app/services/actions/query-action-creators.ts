import { fetch } from 'cross-fetch';

import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../constants';

interface IAction {
  type: string;
  payload: object;
}

function queryResponse(payload: string): IAction {
  return {
    type: QUERY_GRAPH_SUCCESS,
    payload: JSON.parse(payload),
  };
}

export function runQuery(url: string): Function {
  const headers = {Authorization: 'Bearer {token:https://graph.microsoft.com/}'};

  return (dispatch: Function) => {
    return fetch(`https://proxy.apisandbox.msdn.microsoft.com/svc?url=${url}`, { headers })
      .then((response) => response.json(), (error) => console.log(error))
      .then((json) => { console.log(json); dispatch(queryResponse(json)); });
  };
}
