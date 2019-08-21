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
    const runTime = new Date().toISOString();

    if (tokenPresent) {
      return authenticatedRequest(dispatch, query).then(async (response: Response) => {
        await processRequestResult(response, respHeaders, dispatch, runTime);
      });
    }

    return anonymousRequest(dispatch, query).then(async (response: Response) => {
      await processRequestResult(response, respHeaders, dispatch, runTime);
    });
  };

  async function processRequestResult(response: Response,  respHeaders: any, dispatch: Function, runTime: any) {

    const status = response.status;
    let result = await parseResponse(response, respHeaders);
    const duration = respHeaders.duration;

    const contentType = respHeaders['content-type'];
    if (contentType && isImageResponse(contentType)) {
      result = await result.clone().arrayBuffer();
    }

    const historyItem: IHistoryItem = {
      url: query.sampleUrl,
      method: query.selectedVerb,
      headers: query.sampleHeaders,
      body: query.sampleBody,
      runTime,
      status,
      response: result,
      duration,
    };

    dispatch(addHistoryItem(historyItem));

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
