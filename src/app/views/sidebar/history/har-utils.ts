import { IHarFormat, IHarHeaders, IHarPayload } from '../../../../types/har';
import { IHistoryItem } from '../../../../types/history';
import { downloadToLocal } from '../../../utils/download';

export function createHarPayload(query: IHistoryItem): IHarPayload {
  const queryResult = JSON.stringify(query.result);

  const headers: IHarHeaders[] = [];
  if (query.headers) {
    query.headers.forEach(header => {
      const { name, value } = header;
      const head: IHarHeaders = {
        name, value
      }
      headers.push(head)
    });
  }

  let harPayload: IHarPayload = {
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
      mimeType: 'application/json'
    },
    request: {
      headers
    },
    response:
    {
      headers: query.responseHeaders
    },
    sendTime: 0,
    waitTime: 0,
    receiveTime: 0,
    httpVersion: 'HTTP/1.1'
  };

  if (query.body) {
    harPayload = Object.assign(harPayload, { //tslint:disable-line
      postData: {
        mimeType: 'application/json',
        text: query.body
      }
    });
  }
  return harPayload;
}

export function generateHar(payloads: IHarPayload[]): IHarFormat {
  const entries = createEntries(payloads);
  return {
    log: {
      version: '4.0',
      creator: {
        name: 'Graph Explorer',
        version: '4.0'
      },
      entries
    }
  };
}

function createEntries(payloads: IHarPayload[]) {
  const entries: any = [];
  payloads.forEach(payload => {
    entries.push({
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
        bodySize: -1
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
        bodySize: -1
      },
      cache: {},
      timings: {
        send: payload.sendTime,
        wait: payload.waitTime,
        receive: payload.receiveTime
      },
      connection: ''
    });
  });
  return entries;
}

export function exportQuery(content: IHarFormat, requestUrl: string) {
  const url = requestUrl.substr(8).split('/');
  url.pop();

  const filename = `${url.join('_')}.har`;
  downloadToLocal(content, filename);
}


