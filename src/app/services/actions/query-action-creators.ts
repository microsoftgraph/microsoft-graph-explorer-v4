import { fetch } from 'cross-fetch';

import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../constants';

function queryResponse(payload: string) {
  return {
    type: QUERY_GRAPH_SUCCESS,
    payload,
  };
}
export function querySample(url: string): Function {
  return (dispatch: Function) => {
    return fetch(url)
      .then((response) => response.json(), (error) => console.log(error))
      .then((json) => dispatch(queryResponse(json)));
  };
}
