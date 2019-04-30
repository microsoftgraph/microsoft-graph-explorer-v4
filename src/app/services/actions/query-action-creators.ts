import { IAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
import { IRequestOptions } from '../../../types/request';
import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../constants';
import { GraphClient } from '../graph-client';

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
  return (dispatch: Function, getState: Function) => {
    const authState = getState().authResponse;

    if (authState) {
      const isAuthenticated = authState.authenticatedUser;

      if (isAuthenticated) {
        const graphUrl = query.sampleUrl;

        return GraphClient.getInstance()
          .api('/me')
          .get();
      }

      return anonymousRequest(dispatch, query);
    }
    //
    // const hasBody = !!query.sampleBody;
    // const isGET = query.selectedVerb;
    // if (hasBody && !isGET) {
    //   const body = JSON.stringify(query.sampleBody);
    //   options = {...options,  body};
    // }
    //
  };
}

function anonymousRequest(dispatch: Function, query: IQuery) {
  const authToken = '{token:https://graph.microsoft.com/}';
  const graphUrl = `https://proxy.apisandbox.msdn.microsoft.com/svc?url=${query.sampleUrl}`;
  const respHeaders: any = {};


  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };


  let options: IRequestOptions = {};
  options = { method: query.selectedVerb, headers};

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
}

function authenticatedRequest() {

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
