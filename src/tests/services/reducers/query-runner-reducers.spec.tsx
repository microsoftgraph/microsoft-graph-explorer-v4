import { clearQueryError } from '../../../app/services/actions/error-action-creator';
import { queryRunnerError } from '../../../app/services/reducers/query-runner-error';
import { graphResponse } from '../../../app/services/reducers/query-runner-reducers';
import { CLEAR_QUERY_ERROR, QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../../../app/services/redux-constants';

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

  it('should handle QUERY_GRAPH_ERROR', () => {
    const initialState = {};
    const mockResponse = {
      status: 400
    };
    const queryAction = { type: QUERY_GRAPH_ERROR, response: mockResponse };
    const newState = queryRunnerError(initialState, queryAction);

    expect(newState).toEqual(mockResponse);
  });

  it('should handle CLEAR_QUERY_ERROR', () => {
    const initialState = {};

    const action = { type: CLEAR_QUERY_ERROR, response: '' };
    const newState = queryRunnerError(initialState, action);

    expect(newState).toEqual(null);
  });
});
