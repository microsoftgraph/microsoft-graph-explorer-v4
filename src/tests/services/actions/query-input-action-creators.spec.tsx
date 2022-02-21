import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { setSampleQuery } from '../../../app/services/actions/query-input-action-creators';
import { SET_SAMPLE_QUERY_SUCCESS } from '../../../app/services/redux-constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Query input action creators should', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('dispatch SET_SAMPLE_QUERY_SUCCESS when setSampleQuery is called', () => {
    const expectedActions = [
      {
        type: SET_SAMPLE_QUERY_SUCCESS,
        response: {
          selectedVerb: 'GET',
          sampleUrl: 'https://graph.microsoft.com/v1.0/me/'
        }
      }
    ];

    const store = mockStore({ sampleQuery: '' });

    // @ts-ignore
    store.dispatch(setSampleQuery({
      selectedVerb: 'GET',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me/'
    }));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
