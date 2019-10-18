import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { runQuery } from '../../../app/services/actions/query-action-creators';
import { QUERY_GRAPH_RUNNING, QUERY_GRAPH_STATUS, QUERY_GRAPH_SUCCESS } from '../../../app/services/redux-constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('query actions', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('creates QUERY_GRAPH_SUCCESS when runQuery is called', () => {
    const createdAt = new Date().toISOString();
    const sampleUrl = 'https://graph.microsoft.com/v1.0/me/';

    setTimeout(() => { // delays request time by 1 second so that the createdAt dates match
      fetchMock.mockResponseOnce(JSON.stringify({ displayName: 'Megan Bowen', ok: true }), {
        headers: { 'content-type': 'application-json' },
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
          headers: { 'content-type': 'application-json' },
        },
      },
    ];

    const store = mockStore({ graphResponse: '' });
    const query = { sampleUrl };

    // @ts-ignore
    return store.dispatch(runQuery(query))
      .then(() => {
        expect(store.getActions()[0]).toEqual(expectedActions[0]);
      });
  });

  it('dispatches QUERY_GRAPH_STATUS for failed requests', () => {
    const createdAt = new Date().toISOString();
    const sampleUrl = 'https://graph.microsoft.com/v1.0/m/';
    setTimeout(() => { // delays request time by 1 second so that the createdAt dates match
      fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    }, 1000);

    const expectedActions = [
      {
        response: true,
        type: QUERY_GRAPH_RUNNING
      },
      {
        response:
        {
          body: undefined,
          createdAt,
          duration: undefined,
          // tslint:disable-next-line:max-line-length
          har: '{"log":{"version":"2.0","creator":{"name":"Graph Explorer","version":"2.0"},"entries":[{"startedDateTime":"' + createdAt + '","request":{"url":"' + sampleUrl + '","httpVersion":"HTTP/1.1","cookies":[],"queryString":[{"name":"","value":""}],"headersSize":-1,"bodySize":-1},"response":{"status":200,"statusText":"OK","httpVersion":"HTTP/1.1","cookies":[],"headers":{},"content":{"text":"{\\"ok\\":false}","size":12,"mimeType":"application/json"},"redirectURL":"","headersSize":-1,"bodySize":-1},"cache":{},"timings":{"send":0,"wait":0,"receive":0},"connection":""}]}}',
          headers: undefined,
          method: undefined,
          responseHeaders:
            {},
          result:
          {
            ok: false
          },
          status: 200,
          statusText: 'OK',
          url: sampleUrl
        },
        type: 'ADD_HISTORY_ITEM_SUCCESS'
      },
      {
        response: {
          body: { ok: false },
          headers: {}
        },
        type: QUERY_GRAPH_STATUS
      }
    ];

    const store = mockStore({ graphResponse: '' });
    const query = { sampleUrl };

    // @ts-ignore
    return store.dispatch(runQuery(query))
      .then(() => {
        expect(store.getActions()[0]).toEqual(expectedActions[0]);
      });
  });
});
