import configureMockStore from 'redux-mock-store';

import { setSampleQuery } from '../slices/sample-query.slice';
import { SET_SAMPLE_QUERY_SUCCESS } from '../redux-constants';

const mockStore = configureMockStore();

describe('Query input action creators should', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('dispatch SET_SAMPLE_QUERY_SUCCESS when setSampleQuery is called', () => {
    const expectedActions = [
      {
        type: SET_SAMPLE_QUERY_SUCCESS,
        payload: {
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
