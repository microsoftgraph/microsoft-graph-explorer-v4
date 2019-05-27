import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { runQuery } from '../../../app/services/actions/query-action-creators';
import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../../../app/services/redux-constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('creates QUERY_GRAPH_SUCCESS when runQuery is called', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ displayName: 'Megan Bowen', ok: true }), {
      headers: { 'content-type': 'application-json' },
    });

    const expectedActions = [
      {
        type: 'QUERY_GRAPH_RUNNING',
        response:  true
      },
      {
        type: QUERY_GRAPH_SUCCESS,
        response: {
          body: { displayName: 'Megan Bowen', ok: true},
          headers: { 'content-type': 'application-json'},
        },
      },
    ];

    const store = mockStore({ graphResponse: '' });
    const query = {
      sampleUrl: 'https://graph.microsoft.com/v1.0/me/'
    };

    // @ts-ignore
    return store.dispatch(runQuery(query))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('dispatches QUERY_GRAPH_ERROR for failed requests', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));

    const expectedActions = [
      {
        response: true,
        type: 'QUERY_GRAPH_RUNNING'
      },
      {
      response:
        {
          ok: false
        },
        type: 'QUERY_GRAPH_ERROR'
      }
    ];

    const store = mockStore({ graphResponse: '' });
    const query = {
      sampleUrl: 'https://graph.microsoft.com/v1.0/m/'
    };

    // @ts-ignore
    return store.dispatch(runQuery(query))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
