import { Entry, HarFormat, HarHeader } from '../../../../types/har';
import { IHistoryItem } from '../../../../types/history';
import { downloadToLocal } from '../../common/download';

export function createHarEntry(query: IHistoryItem): Entry {
  const queryResult = JSON.stringify(query.result);

  const headers: HarHeader[] = [];
  if (query.headers) {
    query.headers.forEach((header) => {
      const { name, value } = header;
      const head: HarHeader = {
        name,
        value
      };
      headers.push(head);
    });
  }
  const responseHeaders: HarHeader[] = [];
  Object.keys(query.responseHeaders as Record<string, string>).forEach((key) => {
    const head: HarHeader = {
      name: key,
      value: (query.responseHeaders as Record<string, string>)[key]
    };
    responseHeaders.push(head);
  });

  let harEntry: Entry = {
    startedDateTime: query.createdAt.toString(),
    time: query.duration,
    request: {
      method: query.method,
      url: query.url,
      httpVersion: 'HTTP/1.1',
      cookies: [],
      headers,
      queryString: [{ name: '', value: '' }],
      headersSize: -1,
      bodySize: -1,
      postData: undefined
    },
    response: {
      status: query.status,
      statusText: query.statusText,
      httpVersion: 'HTTP/1.1',
      cookies: [],
      headers: responseHeaders,
      content: {
        text: queryResult,
        size: queryResult.length,
        mimeType: 'application/json',
        compression: -1
      },
      redirectURL: '',
      headersSize: -1,
      bodySize: -1
    },
    timings: {
      blocked: 0,
      dns: 0,
      connect: -1,
      send: 0,
      wait: 0,
      receive: 0,
      ssl: 0
    },
    cache: {},
    pageref: ''
  };

  if (query.body) {
    harEntry = Object.assign(harEntry, {
      postData: {
        mimeType: 'application/json',
        text: query.body,
        size: query.body.length,
        compression: -1
      }
    });
  }
  return harEntry;
}

export function generateHar(entries: Entry[]): HarFormat {
  return {
    log: {
      version: '1.2',
      creator: {
        name: 'Graph Explorer',
        version: '4.0'
      },
      entries,
      pages: []
    }
  };
}

export function exportQuery(content: HarFormat, requestUrl: string) {
  const url = requestUrl.substring(8).split('/');
  url.pop();

  const filename = `${url.join('_')}.har`;
  downloadToLocal(content, filename);
}
