/* eslint-disable max-len */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { runQuery } from './query-action-creators';
import { QUERY_GRAPH_SUCCESS } from '../redux-constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Query action creators', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should dispatch QUERY_GRAPH_SUCCESS when runQuery() is called', () => {
    const createdAt = new Date().toISOString();
    const sampleUrl = 'https://graph.microsoft.com/v1.0/me/';

    setTimeout(() => { // delays request time by 1 second so that the createdAt dates match
      fetchMock.mockResponseOnce(JSON.stringify({ displayName: 'Megan Bowen', ok: true }), {
        headers: { 'content-type': 'application-json' }
      });
    }, 1000);

    const expectedActions = [
      {
        type: 'QUERY_GRAPH_RUNNING',
        response: true
      },
      {
        response:
        {
          body: undefined,
          createdAt,
          duration: undefined,
          headers: undefined,
          method: undefined,
          responseHeaders:
          {
            'content-type': 'application-json'
          },
          result:
          {
            displayName: 'Megan Bowen',
            ok: true
          },
          status: 200,
          statusText: 'OK',
          url: sampleUrl
        },
        type: 'ADD_HISTORY_ITEM_SUCCESS'
      },
      {
        type: QUERY_GRAPH_SUCCESS,
        response: {
          body: { displayName: 'Megan Bowen', ok: true },
          headers: { 'content-type': 'application-json' }
        }
      }
    ];

    const store = mockStore({ graphResponse: '' });
    const query = { sampleUrl };

    // @ts-ignore
    return store.dispatch(runQuery(query))
      .then(() => {
        expect(store.getActions()[0]).toEqual(expectedActions[0]);
      })
      .catch((e: Error) => { throw e });
  });

  it('should dispatch QUERY_GRAPH_SUCCESS, ADD_HISTORY_ITEM_SUCCESS and QUERY_GRAPH_STATUS when runQuery is called', () => {
    const sampleUrl = 'https://graph.microsoft.com/v1.0/m/';
    setTimeout(() => { // delays request time by 1 second so that the createdAt dates match
      fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    }, 1000);

    const expectedActions = ['QUERY_GRAPH_SUCCESS', 'ADD_HISTORY_ITEM_SUCCESS', 'QUERY_GRAPH_STATUS'];

    const getDispatchedTypes = (actions: any) => {
      const types_: string[] = [];
      for (const action of actions) {
        types_.push(action.type);
      }
      return types_;
    }

    const compareReceivedAndExpectedTypes = (receivedTypes: string[], expectedTypes: string[]) => {
      expectedTypes.forEach(expectedType => {
        const actionIsAvailable = receivedTypes.includes(expectedType);
        if (!actionIsAvailable) {
          return false;
        }
      });
      return true;
    }

    const store = mockStore({ graphResponse: '' });
    const query = { sampleUrl };

    // @ts-ignore
    return store.dispatch(runQuery(query))
      .then(() => {
        const dispatchedActions = getDispatchedTypes(store.getActions());
        expect(compareReceivedAndExpectedTypes(dispatchedActions, expectedActions)).toBe(true)
      })
      .catch((e: Error) => { throw e });
  });
});
