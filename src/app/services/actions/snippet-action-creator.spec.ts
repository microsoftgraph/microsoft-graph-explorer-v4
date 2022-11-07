import configureMockStore from 'redux-mock-store';
import { AnyAction } from '@reduxjs/toolkit';

import { Header, IQuery } from '../../../types/query-runner';
import { constructHeaderString } from '../../utils/snippet.utils';
import { GET_SNIPPET_PENDING, GET_SNIPPET_SUCCESS } from '../redux-constants';
import { getSnippet } from '../slices/snippet.slice';
import { mockThunkMiddleware } from './mockThunkMiddleware';

const mockStore = configureMockStore([mockThunkMiddleware]);

describe('Snippet actions creators', () => {
  it('should dispatch GET_SNIPPET_ERROR when getSnippet() api call errors out', async () => {
    // Arrange
    const expectedActions = [
      {
        type: 'GET_SNIPPET_PENDING',
        response: null
      },
      {
        type: GET_SNIPPET_SUCCESS,
        payload: {
          CSharp: '{"ok":true}'
        }
      }
    ]

    const store_ = mockStore({
      devxApi: {
        baseUrl: 'https://graphexplorerapi.azurewebsites.net',
        parameters: ''
      },
      sampleQuery: {
        sampleUrl: 'https://graph.microsoft.com/v1.0/me/',
        selectedVerb: 'GET',
        sampleBody: {},
        sampleHeaders: [],
        selectedVersion: 'v1.0'
      }
    });
    fetchMock.mockResponseOnce(JSON.stringify({ ok: true }));

    // Act
    await store_.dispatch(getSnippet('CSharp') as unknown as AnyAction);

    // Assert
    expect(store_.getActions().map(action => {
      const { meta, error, ...rest } = action;
      return rest;
    })).toEqual(expectedActions);
  });

  it('should construct headers string to be sent with the request for obtaining code snippets', () => {
    // Arrange
    const headersWithoutContentType: Header[] = [
      { name: 'ConsistencyLevel', value: 'eventual' },
      { name: 'x-ms-version', value: '1.0' }
    ];

    const headersWithContentType: Header[] = [
      { name: 'ConsistencyLevel', value: 'eventual' },
      { name: 'Content-Type', value: 'application/json' },
      { name: 'x-ms-version', value: '1.0' }
    ];

    const sampleQuery: IQuery = {
      selectedVerb: 'POST',
      selectedVersion: 'v1.0',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me/',
      sampleBody: '',
      sampleHeaders: []
    }

    const sampleWithNoContentType = { ...sampleQuery, sampleHeaders: headersWithoutContentType };
    const sampleWithContentType = { ...sampleQuery, sampleHeaders: headersWithContentType };

    // eslint-disable-next-line max-len
    const expectedStringwithContentType = 'ConsistencyLevel: eventual\r\nContent-Type: application/json\r\nx-ms-version: 1.0\r\n';

    // eslint-disable-next-line max-len
    const expectedStringWithoutContentType = 'ConsistencyLevel: eventual\r\nx-ms-version: 1.0\r\nContent-Type: application/json\r\n';

    // Act
    const headerStringWithoutContentType = constructHeaderString(sampleWithNoContentType);
    const headerStringWithContentType = constructHeaderString(sampleWithContentType);

    // Assert
    expect(headerStringWithContentType).toEqual(expectedStringwithContentType);
    expect(headerStringWithoutContentType).toEqual(expectedStringWithoutContentType);
  })
});
