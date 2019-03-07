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

export function runQuery(url: string): Function {
  const headers = { Authorization: 'Bearer {token:https://graph.microsoft.com/}' };

  return (dispatch: Function) => {
    const respHeaders: any = {};

    return fetch(`https://proxy.apisandbox.msdn.microsoft.com/svc?url=${url}`, { headers })
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
