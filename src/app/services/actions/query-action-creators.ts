import { IAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
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

export function runQuery(query: IQuery): Function {
  let authToken = '{token:https://graph.microsoft.com/}';
  let graphUrl = `https://proxy.apisandbox.msdn.microsoft.com/svc?url=${query.sampleURL}`;
  const respHeaders: any = {};
  const authenticatedUser = localStorage.getItem('authenticatedUser');
  const authUser = (authenticatedUser) ? JSON.parse(authenticatedUser) : null;

  return (dispatch: Function) => {
    if (authenticatedUser && authUser.token) {
      authToken = authUser.token;
      graphUrl = query.sampleURL;
    }
    const headers = { Authorization: `Bearer ${authToken}` };

    return fetch(graphUrl, { headers })
      .then((resp) => {
        if (resp.ok) {
          resp.headers.forEach((val, key) => {
            respHeaders[key] = val;
          });

          const contentType = getContentType(resp.headers);
          if (contentType && isImageResponse(contentType)) {
            return resp;
          } else {
            return resp.json();
          }
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

export function isImageResponse(contentType: string) {
  return contentType === 'application/octet-stream' || contentType.substr(0, 6) === 'image/';
}

export function getContentType(headers: Headers) {
  const full = headers.get('content-type');
  if (full) {
    const delimiterPos = full.indexOf(';');
    if (delimiterPos !== -1) {
        return full.substr(0, delimiterPos);
    } else {
        return full;
    }
  }
}
