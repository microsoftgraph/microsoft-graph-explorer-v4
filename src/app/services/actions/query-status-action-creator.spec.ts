import { CLEAR_RESPONSE, QUERY_GRAPH_STATUS } from '../../../app/services/redux-constants';
import { clearResponse, setQueryResponseStatus } from '../../../app/services/actions/query-status-action-creator';

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
      response
    }

    // Act
    const action = setQueryResponseStatus(response);

    // Assert
    expect(action).toEqual(expectedAction);
  });

  it('should dispatch CLEAR_RESPONSE action when clearResponse() is called', () => {
    // Assert
    const expectedAction = {
      type: CLEAR_RESPONSE
    }

    // Act
    const action = clearResponse();

    // Assert
    expect(action).toEqual(expectedAction);
  });
});
