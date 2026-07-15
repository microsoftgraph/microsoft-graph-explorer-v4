jest.mock('../../common/download', () => ({
  downloadToLocal: jest.fn()
}));

import { createHarEntry, exportQuery, generateHar } from './har-utils';

import { Entry } from '../../../../types/har';
import { IHistoryItem } from '../../../../types/history';
import { downloadToLocal } from '../../common/download';

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

  it('creates har payload with headers', () => {
    const historyItem: IHistoryItem = {
      index: 0,
      statusText: 'OK',
      responseHeaders: { 'content-type': 'application/json', 'x-request-id': '123' },
      result: { name: 'test' },
      duration: 250,
      method: 'POST',
      url: 'https://graph.microsoft.com/v1.0/me/messages',
      status: 201,
      body: '{"subject":"Hello"}',
      headers: [{ name: 'Authorization', value: 'Bearer token' }],
      createdAt: '2023-06-01T00:00:00.000Z'
    }

    const harPayload = createHarEntry(historyItem);
    expect(harPayload.request.method).toBe('POST');
    expect(harPayload.request.headers).toHaveLength(1);
    expect(harPayload.request.headers[0].name).toBe('Authorization');
    expect(harPayload.response.status).toBe(201);
    expect(harPayload.response.headers).toHaveLength(2);
    expect(harPayload.time).toBe(250);
    expect(harPayload.startedDateTime).toBe('2023-06-01T00:00:00.000Z');
    expect((harPayload as any).postData.text).toBe('{"subject":"Hello"}');
  })

  it('creates har payload without body', () => {
    const historyItem: IHistoryItem = {
      index: 0,
      statusText: 'OK',
      responseHeaders: { 'content-type': 'application/json' },
      result: {},
      duration: 100,
      method: 'GET',
      url: 'https://graph.microsoft.com/v1.0/me',
      status: 200,
      headers: [{ name: 'Accept', value: 'application/json' }],
      createdAt: '2023-01-01T00:00:00.000Z'
    }

    const harPayload = createHarEntry(historyItem);
    expect(harPayload.request.postData).toBeUndefined();
  })

  it('creates har payload without headers (undefined)', () => {
    const historyItem: IHistoryItem = {
      index: 0,
      statusText: 'Not Found',
      responseHeaders: {},
      result: { error: 'not found' },
      duration: 50,
      method: 'GET',
      url: 'https://graph.microsoft.com/v1.0/me/unknown',
      status: 404,
      headers: undefined as any,
      createdAt: '2023-01-01'
    }

    const harPayload = createHarEntry(historyItem);
    expect(harPayload.request.headers).toHaveLength(0);
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
    expect(har.log.version).toBe('1.2');
    expect(har.log.creator.name).toBe('Graph Explorer');
  })

  it('generates Har with empty entries', () => {
    const har = generateHar([]);
    expect(har.log.entries).toHaveLength(0);
    expect(har.log.pages).toEqual([]);
  })

  it('generates Har with multiple entries', () => {
    const entries = [
      { startedDateTime: '2023-01-01' } as any,
      { startedDateTime: '2023-01-02' } as any
    ];
    const har = generateHar(entries);
    expect(har.log.entries).toHaveLength(2);
  })

  describe('exportQuery', () => {
    it('should call downloadToLocal with filename from URL', () => {
      const content = { log: { version: '1.2', creator: { name: 'GE', version: '4.0' }, entries: [], pages: [] } };
      exportQuery(content, 'https://graph.microsoft.com/v1.0/me');
      expect(downloadToLocal).toHaveBeenCalledWith(content, 'graph.microsoft.com_v1.0.har');
    });

    it('should handle URL with multiple segments', () => {
      const content = { log: { version: '1.2', creator: { name: 'GE', version: '4.0' }, entries: [], pages: [] } };
      exportQuery(content, 'https://graph.microsoft.com/v1.0/users/messages');
      expect(downloadToLocal).toHaveBeenCalledWith(content, 'graph.microsoft.com_v1.0_users.har');
    });
  })
})