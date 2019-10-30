import { graphResponse } from '../../../app/services/reducers/query-runner-reducers';
import { queryRunnerStatus } from '../../../app/services/reducers/query-runner-status-reducers';
import { CLEAR_QUERY_STATUS, QUERY_GRAPH_STATUS, QUERY_GRAPH_SUCCESS } from '../../../app/services/redux-constants';

describe('Query Runner Reducer', () => {
  it('should return initial state', () => {
    const initialState = {};
    const dummyAction = { type: 'Dummy', response: { displayName: 'Megan Bowen' } };
    const newState = graphResponse(initialState, dummyAction);

    expect(newState).toEqual(initialState);
  });

  it('should handle QUERY_GRAPH_SUCCESS', () => {
    const initialState = {};
    const mockResponse = {
      body: {
        displayName: 'Megan Bowen',
      },
      headers: {
        'content-type': 'application-json',
      },
    };
    const queryAction = { type: QUERY_GRAPH_SUCCESS, response: mockResponse };
    const newState = graphResponse(initialState, queryAction);

    expect(newState).toEqual(mockResponse);
  });

  it('should handle QUERY_GRAPH_STATUS', () => {
    const initialState = {};
    const mockResponse = {
      status: 400
    };
    const queryAction = { type: QUERY_GRAPH_STATUS, response: mockResponse };
    const newState = queryRunnerStatus(initialState, queryAction);

    expect(newState).toEqual(mockResponse);
  });

  it('should handle CLEAR_QUERY_STATUS', () => {
    const initialState = {};

    const action = { type: CLEAR_QUERY_STATUS, response: '' };
    const newState = queryRunnerStatus(initialState, action);

    expect(newState).toEqual(null);
  });
});
