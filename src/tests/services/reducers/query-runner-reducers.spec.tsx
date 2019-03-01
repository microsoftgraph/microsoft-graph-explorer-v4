import { QUERY_GRAPH_SUCCESS } from '../../../app/services/constants';
import { queryRunnerReducer } from '../../../app/services/reducers/query-runner-reducers';

describe('Query Runner Reducer', () => {
  it('should return initial state', () => {
    const initialState = {};
    const dummyAction = { type: 'Dummy', response: 'response'};
    const newState = queryRunnerReducer(initialState, dummyAction);

    expect(newState).toEqual(initialState);
  });

  it('should handle QUERY_GRAPH_SUCCESS', () => {
    const initialState = {};
    const queryAction = { type: QUERY_GRAPH_SUCCESS, response: 'response' };
    const newState = queryRunnerReducer(initialState, queryAction);

    expect(newState).toContain('response');
  });
});
