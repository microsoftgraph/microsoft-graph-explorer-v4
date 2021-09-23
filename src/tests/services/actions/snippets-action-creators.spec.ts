import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getSnippetSuccess } from '../../../app/services/actions/snippet-action-creator';
import { GET_SNIPPET_SUCCESS } from '../../../app/services/redux-constants';

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
});
