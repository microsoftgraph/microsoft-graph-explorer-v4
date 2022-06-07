import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  getSnippetSuccess, getSnippetError,
  getSnippetPending,
  getSnippet,
  constructHeaderString
} from './snippet-action-creator';
import { GET_SNIPPET_SUCCESS, GET_SNIPPET_ERROR, GET_SNIPPET_PENDING } from '../redux-constants';
import { Header } from '../../../types/query-runner';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('snippet actions', () => {
  it('dispatches GET_SNIPPET_SUCCESS when getSnippetSuccess is called', () => {
    const snippet = 'GraphServiceClient graphClient = new GraphServiceClient( authProvider );';

    const expectedAction = [{
      type: GET_SNIPPET_SUCCESS,
      response: {
        csharp: snippet
      }
    }];

    const store = mockStore({ snippets: {} });

    // @ts-ignore
    store.dispatch(getSnippetSuccess({
      csharp: snippet
    }));

    expect(store.getActions()).toEqual(expectedAction);
  });

  it('dispatches GET_SNIPPET_PENDING when getSnippetPending is called', () => {
    const expectedAction = {
      type: GET_SNIPPET_PENDING
    };

    const action = getSnippetPending();

    expect(action).toEqual(expectedAction);
  })

  it('dispatches GET_SNIPPET_ERROR when getSnippetError is called', () => {
    const response = {};
    const expectedAction = {
      type: GET_SNIPPET_ERROR,
      response
    };

    const action = getSnippetError(response);

    expect(action).toEqual(expectedAction);
  })

  it('dispatches GET_SNIPPET_ERROR when getSnippet function fails', () => {
    // Arrange
    const expectedActions = [
      {
        type: 'GET_SNIPPET_PENDING'
      },
      {
        type: GET_SNIPPET_SUCCESS,
        response: {
          CSharp: '{"ok":true}'
        }
      }
    ]

    const store = mockStore({
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

    // Act and Assert
    // @ts-ignore
    store.dispatch(getSnippet('CSharp'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      })
      .catch((e: Error) => { throw e });

  });

  it('Constructs headers string to be sent on the wire', () => {
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
    // eslint-disable-next-line max-len
    const expectedStringwithContentType = 'ConsistencyLevel: eventual\r\nContent-Type: application/json\r\nx-ms-version: 1.0\r\n';

    // eslint-disable-next-line max-len
    const expectedStringWithoutContentType = 'ConsistencyLevel: eventual\r\nx-ms-version: 1.0\r\nContent-Type: application/json\r\n';

    // Act
    const headerStringWithoutContentType = constructHeaderString(headersWithoutContentType);
    console.log(headerStringWithoutContentType);
    const headerStringWithContentType = constructHeaderString(headersWithContentType);

    // Assert
    expect(headerStringWithContentType).toEqual(expectedStringwithContentType);
    expect(headerStringWithoutContentType).toEqual(expectedStringWithoutContentType);
  })
});
