import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getProfileInfo, profileRequestSuccess } from '../../../app/services/actions/profile-action-creators';
import {
  PROFILE_REQUEST_ERROR, PROFILE_REQUEST_SUCCESS,
  QUERY_GRAPH_RUNNING
} from '../../../app/services/redux-constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('creates PROFILE_REQUEST_SUCCESS when profileRequestSuccess is called', () => {

    const response = fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    const expectedAction = {
      type: PROFILE_REQUEST_SUCCESS,
      response
    };

    const action = profileRequestSuccess(response);
    expect(action).toEqual(expectedAction);
  });

  it('dispatches PROFILE_REQUEST_ERROR for failed requests', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));

    const expectedActions = [
      {
        response: true,
        type: QUERY_GRAPH_RUNNING
      },
      {
        response: { response: undefined },
        type: PROFILE_REQUEST_ERROR
      }
    ];

    const store = mockStore({});
    const query = {
      sampleUrl: 'https://graph.microsoft.com/v1.0/m/'
    };

    // @ts-ignore
    return store.dispatch(getProfileInfo(query))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
