import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  getSnippetSuccess, getSnippetError,
  getSnippetPending,
  getSnippet
} from '../../../app/services/actions/snippet-action-creator';
import { GET_SNIPPET_SUCCESS, GET_SNIPPET_ERROR, GET_SNIPPET_PENDING } from '../../../app/services/redux-constants';

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
        type: GET_SNIPPET_SUCCESS,
        response: {
          CSharp: '{"ok":false}'
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
    fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));

    // Act and Assert
    // @ts-ignore
    store.dispatch(getSnippet('CSharp'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      })

  })
});
