import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { queryResponse, runQuery } from '../../../app/services/actions/query-action-creators';
import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../../../app/services/constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions', () => {
  it('creates QUERY_GRAPH_SUCCESS when runQuery is called', () => {
    fetchMock.mockResponse(JSON.stringify({ displayName: 'Megan Bowen' }), {
      headers: { 'content-type': 'application-json' },
    });

    const expectedActions = [
      {
        type: QUERY_GRAPH_SUCCESS,
        response: {
          body: { displayName: 'Megan Bowen' },
          headers: { 'content-type': 'application-json'},
        },
      },
    ];

    const store = mockStore({ graphResponse: '' });

    // @ts-ignore
    return store.dispatch(runQuery('https://graph.microsoft.com/v1.0/me/'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
