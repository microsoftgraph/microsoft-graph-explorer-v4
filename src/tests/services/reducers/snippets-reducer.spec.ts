import { snippets } from '../../../app/services/reducers/snippet-reducer';
import { GET_SNIPPET_SUCCESS } from '../../../app/services/redux-constants';

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
      response: snippet,
    };

    const newState = snippets(initialState, dummyAction);
    expect(newState).toEqual(response);
  });
});
