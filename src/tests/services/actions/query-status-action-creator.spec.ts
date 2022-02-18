import { CLEAR_QUERY_STATUS, CLEAR_RESPONSE, QUERY_GRAPH_STATUS } from '../../../app/services/redux-constants';
import {
  clearQueryStatus, clearResponse,
  setQueryResponseStatus
} from '../../../app/services/actions/query-status-action-creator';

describe('Query Action Creators', () => {
  it('Tests the query response status action', () => {
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

  it('Tests the clear response action', () => {
    // Assert
    const expectedAction = {
      type: CLEAR_RESPONSE
    }

    // Act
    const action = clearResponse();

    // Assert
    expect(action).toEqual(expectedAction);
  });
})

//add test for clearQueryStatus