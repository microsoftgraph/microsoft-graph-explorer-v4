import { writeData } from '../../../store/cache';
import { IHistoryItem } from '../../../types/history';
import { IQuery } from '../../../types/query-runner';
import { createHarPayload, generateHar } from '../../views/sidebar/history/historyUtil';
import { queryResponseError } from './error-action-creator';
import {
  anonymousRequest, authenticatedRequest, isImageResponse,
  parseResponse, queryResponse
} from './query-action-creator-util';
import { addHistoryItem } from './request-history-action-creators';

export function runQuery(query: IQuery): Function {
  return (dispatch: Function, getState: Function) => {
    const tokenPresent = getState().authToken;
    const respHeaders: any = {};
    const createdAt = new Date().toISOString();

    if (tokenPresent) {
      return authenticatedRequest(dispatch, query).then(async (response: Response) => {
        await processResponse(response, respHeaders, dispatch, createdAt);
      });
    }

    return anonymousRequest(dispatch, query).then(async (response: Response) => {
      await processResponse(response, respHeaders, dispatch, createdAt);
    });
  };

  async function processResponse(response: Response, respHeaders: any, dispatch: Function, createdAt: any) {

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
  const statusText = response.statusText;
  const { duration, contentType } = respHeaders;

  if (isImageResponse(contentType)) {
    result = await result.clone().arrayBuffer();
  }

  const historyItem: IHistoryItem = {
    url: query.sampleUrl,
    method: query.selectedVerb,
    headers: query.sampleHeaders,
    body: query.sampleBody,
    responseHeaders: respHeaders,
    createdAt,
    status,
    statusText,
    result,
    duration,
    har: ''
  };

  const harPayload = createHarPayload(historyItem);
  const har = JSON.stringify(generateHar(harPayload));
  historyItem.har = har;

  writeData(historyItem);

  dispatch(addHistoryItem(historyItem));
  return result;
}

