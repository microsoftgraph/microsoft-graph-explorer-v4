import { snippets } from '../../../app/services/reducers/snippet-reducer';
import { GET_SNIPPET_SUCCESS } from '../../../app/services/redux-constants';

describe('Graph Explorer Snippet Reducer', () => {
  it('should change graph explorer Mode', () => {
    const initialState = {};
    const snippet = { csharp: 'GraphServiceClient graphClient = new GraphServiceClient( authProvider );' };

    const dummyAction = {
      type: GET_SNIPPET_SUCCESS,
      response: snippet,
    };
    const newState = snippets(initialState, dummyAction);
    expect(newState).toEqual(snippet);
  });
});
