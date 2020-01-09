import { IHarFormat, IHarPayload } from '../../../../types/har';
import { IHistoryItem } from '../../../../types/history';

export function createHarPayload(query: IHistoryItem) {
  const queryResult = JSON.stringify(query.result);

  let harPayload = {
    startedDateTime: query.createdAt.toString(),
    time: query.duration,
    method: query.method,
    url: query.url,
    cookies: [],
    queryString: [{ name: '', value: '' }],
    status: query.status,
    statusText: query.statusText,
    content: {
      text: queryResult,
      size: queryResult.length,
      mimeType: 'application/json',
    },
    request: {
      headers: query.headers,
    },
    response:
    {
      headers: query.responseHeaders
    },
    sendTime: 0,
    waitTime: 0,
    receiveTime: 0,
    httpVersion: 'HTTP/1.1',
  };

  if (query.body) {
    harPayload = Object.assign(harPayload, { //tslint:disable-line
      postData: {
        mimeType: 'application/json',
        text: query.body,
      },
    });
  }
  return harPayload;
}

export function generateHar(payload: IHarPayload): IHarFormat {
  return {
    log: {
      version: '2.0',
      creator: {
        name: 'Graph Explorer',
        version: '2.0',
      },
      entries: [
        {
          startedDateTime: payload.startedDateTime,
          time: payload.time,
          request: {
            method: payload.method,
            url: payload.url,
            httpVersion: payload.httpVersion,
            cookies: payload.cookies,
            headers: payload.request.headers,
            queryString: payload.queryString,
            postData: payload.postData,
            headersSize: -1,
            bodySize: -1,
          },
          response: {
            status: payload.status,
            statusText: payload.statusText,
            httpVersion: payload.httpVersion,
            cookies: payload.cookies,
            headers: payload.response.headers,
            content: payload.content,
            redirectURL: '',
            headersSize: -1,
            bodySize: -1,
          },
          cache: {},
          timings: {
            send: payload.sendTime,
            wait: payload.waitTime,
            receive: payload.receiveTime,
          },
          connection: '',
        },
      ],
    },
  };
}


