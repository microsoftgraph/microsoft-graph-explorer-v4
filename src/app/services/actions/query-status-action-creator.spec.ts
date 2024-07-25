import { QUERY_GRAPH_STATUS } from '../../../app/services/redux-constants';
import { setQueryResponseStatus } from '../../../app/services/slices/query-status.slice';

describe('Query Action Creators', () => {
  it('should dispatch QUERY_GRAPH_STATUS when setQueryResponseStatus() is called', () => {
    // Arrange
    const response = {
      ok: false,
      statusText: 'Something worked!',
      status: 200,
      messageType: 1,
      hint: 'Something worked!'
    }

    const expectedAction = {
      type: QUERY_GRAPH_STATUS,
      payload: response
    }

    // Act
    const action = setQueryResponseStatus(response);

    // Assert
    expect(action).toEqual(expectedAction);
  });
});
