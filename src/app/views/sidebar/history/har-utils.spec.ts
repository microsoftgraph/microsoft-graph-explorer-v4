/* eslint-disable @typescript-eslint/indent */

import { IHarPayload } from '../../../../types/har';
import { IHistoryItem } from '../../../../types/history';
import { createHarPayload, generateHar } from './har-utils';

describe('Tests history items util functions', () => {
    it('creates har payload', () => {
        const historyItem: IHistoryItem = {
            index: 0,
            statusText: 'OK',
            responseHeaders: [],
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
        const harPayload = createHarPayload(historyItem);

        // Assert
        expect(harPayload.method).toBe('GET');

    })

    it('generates Har', () => {
        const payloads: IHarPayload[] = [
            {
                startedDateTime: '2020-04-01T00:00:00.000Z',
                time: 0,
                method: 'GET',
                url: 'http://localhost:8080/',
                cookies: [],
                queryString: [{ name: '', value: '' }],
                status: 200,
                statusText: 'OK',
                content: {
                    text: 'Some text',
                    size: 9,
                    mimeType: 'application/json'
                },
                request: {
                    headers: []
                },
                response: {
                    headers: []
                },
                sendTime: 0,
                waitTime: 0,
                receiveTime: 0,
                httpVersion: 'HTTP/1.1'
            }
        ]

        // Act
        const har = generateHar(payloads);

        // Assert
        expect(har.log.entries.length).toBe(1);
    })
})