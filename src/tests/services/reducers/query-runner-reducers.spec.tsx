import { QUERY_GRAPH_SUCCESS } from '../../../app/services/constants';
import { queryRunnerReducer } from '../../../app/services/reducers/query-runner-reducers';

describe('Query Runner Reducer', () => {
  it('should return initial state', () => {
    const initialState = {};
    const dummyAction = { type: 'Dummy', response: { displayName: 'Megan Bowen' } };
    const newState = queryRunnerReducer(initialState, dummyAction);

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
    const newState = queryRunnerReducer(initialState, queryAction);

    expect(newState).toEqual(mockResponse);
  });
});
