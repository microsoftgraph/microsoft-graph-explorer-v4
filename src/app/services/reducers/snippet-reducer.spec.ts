import { snippets } from './snippet-reducer';
import { GET_SNIPPET_ERROR, GET_SNIPPET_SUCCESS } from '../redux-constants';

describe('Graph Explorer Snippet Reducer', () => {
  it('should set csharp code snippet', () => {
    const initialState = {
      pending: false,
      data: {},
      error: null
    };
    const snippet = { csharp: 'GraphServiceClient graphClient = new GraphServiceClient( authProvider );' };

    const response = {
      data: snippet,
      error: null,
      pending: false
    };
    const dummyAction = {
      type: GET_SNIPPET_SUCCESS,
      response: snippet
    };

    const newState = snippets(initialState, dummyAction);
    expect(newState).toEqual(response);
  });

  it('should handle GET_SNIPPET_ERROR', () => {
    const initialState = {
      pending: false,
      data: {},
      error: null
    }

    const action = {
      type: GET_SNIPPET_ERROR,
      response: 'error'
    }

    const expectedAction = {
      pending: false,
      data: null,
      error: 'error'
    }

    const newState = snippets(initialState, action);
    expect(newState).toEqual(expectedAction);
  })
});
