/* eslint-disable max-len */
import configureMockStore from 'redux-mock-store';

import { AnyAction } from '@reduxjs/toolkit';
import { IQuery } from '../../../types/query-runner';
import { ADD_HISTORY_ITEM_SUCCESS, QUERY_GRAPH_RUNNING, QUERY_GRAPH_STATUS, QUERY_GRAPH_SUCCESS } from '../redux-constants';
import { runQuery } from '../slices/graph-response.slice';
import { mockThunkMiddleware } from './mockThunkMiddleware';

const mockStore = configureMockStore([mockThunkMiddleware]);

describe('Query action creators', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it.skip('should dispatch QUERY_GRAPH_SUCCESS when runQuery() is called', () => {
    const createdAt = new Date().toISOString();
    const sampleUrl = 'https://graph.microsoft.com/v1.0/me/';

    setTimeout(() => { // delays request time by 1 second so that the createdAt dates match
      fetchMock.mockResponseOnce(JSON.stringify({ displayName: 'Megan Bowen', ok: true }), {
        headers: { 'content-type': 'application-json' }
      });
    }, 1000);

    const expectedActions = [
      {
        type: QUERY_GRAPH_RUNNING
      },
      {
        payload:
        {
          body: undefined,
          createdAt,
          duration: undefined,
          headers: {},
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
        type: ADD_HISTORY_ITEM_SUCCESS
      },
      {
        type: QUERY_GRAPH_SUCCESS,
        payload: {
          body: { displayName: 'Megan Bowen', ok: true },
          headers: { 'content-type': 'application-json' }
        }
      }
    ];

    const query: IQuery = {
      sampleUrl,
      sampleHeaders: [],
      sampleBody: '',
      selectedVerb: 'GET',
      selectedVersion: 'v1.0'
    }
    const store_ = mockStore({ graphResponse: '' });
    store_.dispatch(runQuery(query) as unknown as AnyAction);
    expect(store_.getActions().map(action => {
      const { meta, ...rest } = action;
      return rest;
    })).toEqual(expectedActions);

  });

  it('should dispatch QUERY_GRAPH_SUCCESS, ADD_HISTORY_ITEM_SUCCESS and QUERY_GRAPH_STATUS when runQuery is called', () => {
    const sampleUrl = 'https://graph.microsoft.com/v1.0/m/';
    setTimeout(() => { // delays request time by 1 second so that the createdAt dates match
      fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    }, 1000);

    const expectedActions = [QUERY_GRAPH_SUCCESS, ADD_HISTORY_ITEM_SUCCESS, QUERY_GRAPH_STATUS];

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

  it.skip('should dispatch query status when a 401 is received', () => {
    const sampleUrl = 'https://graph.microsoft.com/v1.0/me';
    const query: IQuery = {
      sampleUrl,
      sampleHeaders: [],
      sampleBody: '',
      selectedVerb: 'GET',
      selectedVersion: 'v1.0'
    }

    const store_ = mockStore({ graphResponse: '' });
    store_.dispatch(runQuery(query) as unknown as AnyAction);
    const mockFetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 401,
        body: {},
        headers: [{ 'content-type': 'application-json' }]
      })
    });

    window.fetch = mockFetch;

    store_.dispatch(runQuery(query) as unknown as AnyAction)
      .then((response: { type: any; payload: { ok: boolean; }; }) => {
        expect(response.type).toBe(QUERY_GRAPH_STATUS);
        expect(response.payload.ok).toBe(false);
      })
      .catch((e: Error) => { throw e });

  })
});
