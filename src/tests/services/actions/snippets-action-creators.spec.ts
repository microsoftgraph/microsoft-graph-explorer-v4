import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  getSnippetSuccess, getSnippetError,
  getSnippetPending
} from '../../../app/services/actions/snippet-action-creator';
import { GET_SNIPPET_SUCCESS, GET_SNIPPET_ERROR, GET_SNIPPET_PENDING } from '../../../app/services/redux-constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('snippet actions', () => {
  it('dispatches GET_SNIPPET_SUCCESS', () => {
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

  it('creates GET_SNIPPET_PENDING when getSnippetPending is called', () => {
    const expectedAction = {
      type: GET_SNIPPET_PENDING
    };

    const action = getSnippetPending();

    expect(action).toEqual(expectedAction);
  })

  it('creates GET_SNIPPET_ERROR when getSnippetError is called', () => {
    const response = {};
    const expectedAction = {
      type: GET_SNIPPET_ERROR,
      response
    };

    const action = getSnippetError(response);

    expect(action).toEqual(expectedAction);
  })
});
