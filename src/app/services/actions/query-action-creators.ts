import { IAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
import { IRequestOptions } from '../../../types/request';
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
  let graphUrl = `https://proxy.apisandbox.msdn.microsoft.com/svc?url=${query.sampleUrl}`;
  const respHeaders: any = {};

  return (dispatch: Function, getState: Function) => {
    const state = getState().authResponse;
    if (state) {
      const authenticatedUser = state.authenticatedUser;
      if (authenticatedUser && authenticatedUser.token) {
        authToken = authenticatedUser.token;
        graphUrl = query.sampleUrl;
      }
    }

    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };

    let options: IRequestOptions = {};
    options = { method: query.selectedVerb, headers};

    const hasBody = !!query.sampleBody;
    const isGET = query.selectedVerb;
    if (hasBody && !isGET) {
      const body = JSON.stringify(query.sampleBody);
      options = {...options,  body};
    }

    return fetch(graphUrl, options)
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
      .then((json) =>
        dispatch(
          queryResponse({
            body: json,
            headers: respHeaders,
          }),
        ),
      )
      .catch((error) => dispatch(queryResponseError(error)));
  };
}

export function isImageResponse(contentType: string) {
  return (
    contentType === 'application/octet-stream' ||
    contentType.substr(0, 6) === 'image/'
  );
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
