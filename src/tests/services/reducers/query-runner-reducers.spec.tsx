import { graphResponse } from '../../../app/services/reducers/query-runner-reducers';
import { QUERY_GRAPH_SUCCESS } from '../../../app/services/redux-constants';

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
});
