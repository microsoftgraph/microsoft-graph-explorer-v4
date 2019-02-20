import { fetch } from 'cross-fetch';

import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../constants';

function queryResponse(payload: string) {
  return {
    type: QUERY_GRAPH_SUCCESS,
    payload,
  };
}

export function querySample(url: string): Function {
  const headers = {Authorization: 'Bearer {token:https://graph.microsoft.com/}'};

  return (dispatch: Function) => {
    return fetch(`https://proxy.apisandbox.msdn.microsoft.com/svc?url=${url}`, { headers })
      .then((response) => response.json(), (error) => console.log(error))
      .then((json) => { console.log(json); dispatch(queryResponse(json)); });
  };
}
