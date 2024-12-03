import { Entry } from '../../../../types/har';
import { IHistoryItem } from '../../../../types/history';
import { createHarEntry, generateHar } from './har-utils';

describe('Tests history items util functions', () => {
  it('creates har payload', () => {
    const historyItem: IHistoryItem = {
      index: 0,
      statusText: 'OK',
      responseHeaders: {},
      result: {},
      duration: 0,
      method: 'GET',
      url: 'http://localhost:8080/',
      status: 200,
      body: '',
      headers: [],
      createdAt: '3232'
    }

    // Act
    const harPayload = createHarEntry(historyItem);

    // Assert
    expect(harPayload.request.method).toBe('GET');

  })

  it('generates Har', () => {
    const entry: Entry[] = [{
      startedDateTime: '2020-04-01T00:00:00.000Z',
      time: 0,
      request: {
        method: 'GET',
        url: 'http://localhost:8080/',
        httpVersion: 'HTTP/1.1',
        cookies: [],
        queryString: [{ name: '', value: '' }],
        headers: [{ name: '', value: '' }],
        headersSize: -1,
        bodySize: -1,
        postData: undefined
      },
      response: {
        status: 200,
        statusText: 'OK',
        httpVersion: 'HTTP/1.1',
        cookies: [],
        content: {
          text: 'Some text',
          size: 9,
          mimeType: 'application/json',
          compression: -1
        },
        headers: [{ name: '', value: '' }],
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
    }]

    // Act
    const har = generateHar(entry);

    // Assert
    expect(har.log.entries.length).toBe(1);
  })
})