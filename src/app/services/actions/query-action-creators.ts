import { IAction } from '../../../types/action';
import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../constants';
export function queryResponse(response: object): IAction {
  return {
    type: QUERY_GRAPH_SUCCESS,
    response,
  };
}

export function queryResponseError(response: object): IAction {
  return {
    type: QUERY_GRAPH_ERROR,
    response,
  };
}

export function runQuery(url: string, identified: boolean = false): Function {
  return (dispatch: Function, getState: Function) => {
    const respHeaders: any = {};
    const authentication = getState().authResponse;
    let authToken = '{token:https://graph.microsoft.com/}';
    let graphUrl = `https://proxy.apisandbox.msdn.microsoft.com/svc?url=${url}`;
    if (authentication && authentication.authenticated && identified) {
      authToken = authentication.authenticated.token;
      graphUrl = url;
    }
    const headers = { Authorization: `Bearer ${authToken}` };
    return fetch(graphUrl, { headers })
      .then((resp) => {
        if (resp.ok) {
          resp.headers.forEach((val, key) => {
            respHeaders[key] = val;
          });
          return resp.json();
        }
        throw new Error('The request was not completed');
      })
      .then((json) => dispatch(queryResponse({
        body: json,
        headers: respHeaders,
      })))
      .catch((error) => dispatch(queryResponseError(error)));
  };
}
