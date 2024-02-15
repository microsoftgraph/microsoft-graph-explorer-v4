import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  getSnippetSuccess, getSnippetError,
  getSnippetPending,
  getSnippet,
  constructHeaderString
} from './snippet-action-creator';
import { GET_SNIPPET_SUCCESS, GET_SNIPPET_ERROR, GET_SNIPPET_PENDING } from '../redux-constants';
import { Header, IQuery } from '../../../types/query-runner';
import { AppAction } from '../../../types/action';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Snippet actions creators', () => {
  it('should dispatch GET_SNIPPET_SUCCESS when getSnippetSuccess() is called', () => {
    const snippet = 'GraphServiceClient graphClient = new GraphServiceClient( authProvider );';

    const expectedAction: AppAction[] = [{
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

  it('should dispatch GET_SNIPPET_PENDING when getSnippetPending() is called', () => {
    const expectedAction: AppAction = {
      type: GET_SNIPPET_PENDING,
      response: null
    };

    const action = getSnippetPending();

    expect(action).toEqual(expectedAction);
  })

  it('should dispatch GET_SNIPPET_ERROR when getSnippetError() is called', () => {
    const response = {};
    const expectedAction: AppAction = {
      type: GET_SNIPPET_ERROR,
      response
    };

    const action = getSnippetError(response);

    expect(action).toEqual(expectedAction);
  })

  it('should dispatch GET_SNIPPET_ERROR when getSnippet() api call errors out', () => {
    // Arrange
    const expectedActions = [
      {
        type: 'GET_SNIPPET_PENDING',
        response: null
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
