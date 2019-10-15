import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { setQueryVersion, setSampleQuery } from '../../../app/services/actions/query-input-action-creators';
import { SELECT_VERSION_SUCCESS, SET_SAMPLE_QUERY_SUCCESS } from '../../../app/services/redux-constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('creates SET_SAMPLE_QUERY_SUCCESS when setSampleQuery is called', () => {
    const expectedActions = [
      {
        type: SET_SAMPLE_QUERY_SUCCESS,
        response: {
          selectedVerb: 'GET',
          sampleUrl: 'https://graph.microsoft.com/v1.0/me/'
        }
      },
    ];

    const store = mockStore({ sampleQuery: '' });

    // @ts-ignore
    store.dispatch(setSampleQuery({
      selectedVerb: 'GET',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me/'
    }));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('creates SELECT_VERSION_SUCCESS when setQueryVersion is called', () => {
    const expectedActions = [
      {
        type: SELECT_VERSION_SUCCESS,
        response: 'beta'
      },
    ];

    const store = mockStore({ selectedVersion: 'v1.0' });

    // @ts-ignore
    store.dispatch(setQueryVersion('beta'));
    expect(store.getActions()).toEqual(expectedActions);
  });

});
