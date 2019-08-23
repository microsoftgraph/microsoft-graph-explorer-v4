import { writeData } from '../../../store/cache';
import { IHistoryItem } from '../../../types/history';
import { IQuery } from '../../../types/query-runner';
import { queryResponseError } from './error-action-creator';
import { anonymousRequest, authenticatedRequest,
  isImageResponse, parseResponse, queryResponse } from './query-action-creator-util';
import { addHistoryItem } from './request-history-action-creators';

export function runQuery(query: IQuery): Function {
  return (dispatch: Function, getState: Function) => {
    const tokenPresent = getState().authToken;
    const respHeaders: any = {};
    const createdAt = new Date().toISOString();

    if (tokenPresent) {
      return authenticatedRequest(dispatch, query).then(async (response: Response) => {
        await processResponse (response, respHeaders, dispatch, createdAt);
      });
    }

    return anonymousRequest(dispatch, query).then(async (response: Response) => {
      await processResponse (response, respHeaders, dispatch, createdAt);
    });
  };

  async function processResponse (response: Response,  respHeaders: any, dispatch: Function, createdAt: any) {

    const result = await parseResponse(response, respHeaders);

    createHistory(response, respHeaders, query, createdAt, dispatch, result);

    if (response && response.ok) {
      return dispatch(queryResponse({
        body: result,
        headers: respHeaders
      }));
    }
    else {
      return dispatch(queryResponseError(response));
    }

  }
}

async function createHistory(response: Response, respHeaders: any, query: IQuery,
  createdAt: any, dispatch: Function, result: any) {
  const status = response.status;
  const { duration, contentType } = respHeaders;

  if (isImageResponse(contentType)) {
    result = await result.clone().arrayBuffer();
  }

  const historyItem: IHistoryItem = {
    url: query.sampleUrl,
    method: query.selectedVerb,
    headers: query.sampleHeaders,
    body: query.sampleBody,
    createdAt,
    status,
    response: result,
    duration,
  };

  writeData(historyItem);

  dispatch(addHistoryItem(historyItem));
  return result;
}

