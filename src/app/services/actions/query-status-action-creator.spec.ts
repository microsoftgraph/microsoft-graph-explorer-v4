import configureMockStore from 'redux-mock-store';

import { QUERY_GRAPH_STATUS } from '../../../app/services/redux-constants';
import { setQueryResponseStatus } from '../../../app/services/slices/query-status.slice';

const mockStore = configureMockStore([]);

describe('Query Action Creators', () => {
  it('should dispatch QUERY_GRAPH_STATUS when setQueryResponseStatus() is called', () => {
    // Arrange
    const payload = {
      ok: false,
      statusText: 'Something worked!',
      status: 200,
      messageBarType: 'success',
      hint: 'Something worked!'
    }

    const expectedAction = {
      type: QUERY_GRAPH_STATUS,
      payload
    }

    // Act
    const store = mockStore({ queryRunnerStatus: null, auth: {} });
    store.dispatch(setQueryResponseStatus(payload));

    // Assert
    expect(store.getActions()).toEqual([expectedAction]);
  });
});
