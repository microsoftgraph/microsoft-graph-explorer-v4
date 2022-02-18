import { graphResponse } from '../../../app/services/reducers/query-runner-reducers';
import { queryRunnerStatus } from '../../../app/services/reducers/query-runner-status-reducers';
import { CLEAR_QUERY_STATUS, QUERY_GRAPH_RUNNING, QUERY_GRAPH_STATUS,
  QUERY_GRAPH_SUCCESS, VIEW_HISTORY_ITEM_SUCCESS } from '../../../app/services/redux-constants';
import { IGraphResponse } from '../../../types/query-response';

describe('Query Runner Reducer', () => {
  it('should return initial state', () => {
    const initialState: IGraphResponse = { body: undefined, headers: undefined };
    const dummyAction = { type: 'Dummy', response: { displayName: 'Megan Bowen' } };
    const newState = graphResponse(initialState, dummyAction);

    expect(newState).toEqual(initialState);
  });

  it('should handle QUERY_GRAPH_SUCCESS', () => {
    const initialState: IGraphResponse = { body: undefined, headers: undefined };
    const mockResponse = {
      body: {
        displayName: 'Megan Bowen'
      },
      headers: {
        'content-type': 'application-json'
      }
    };
    const queryAction = { type: QUERY_GRAPH_SUCCESS, response: mockResponse };
    const newState = graphResponse(initialState, queryAction);

    expect(newState).toEqual(mockResponse);
  });

  it('should handle QUERY_GRAPH_STATUS', () => {
    const initialState: IGraphResponse = { body: undefined, headers: undefined };
    const mockResponse = {
      status: 400
    };
    const queryAction = { type: QUERY_GRAPH_STATUS, response: mockResponse };
    const newState = queryRunnerStatus(initialState, queryAction);

    expect(newState).toEqual(mockResponse);
  });

  it('should handle CLEAR_QUERY_STATUS', () => {
    const initialState: IGraphResponse = { body: undefined, headers: undefined };

    const action = { type: CLEAR_QUERY_STATUS, response: '' };
    const newState = queryRunnerStatus(initialState, action);

    expect(newState).toEqual(null);
  });

  it('should handle VIEW_HISTORY_ITEM_UCCESS', () => {
    const initialState: IGraphResponse = { body: undefined, headers: undefined };
    const mockResponse = {
      body: {
        displayName: 'Megan Bowen'
      },
      headers: {
        'content-type': 'application-json'
      }
    };

    const action  = { type: VIEW_HISTORY_ITEM_SUCCESS, response: mockResponse };

    const newState = queryRunnerStatus(initialState, action);
    expect(newState).toEqual(null);
  });

  it('should handle QUERY_GRAPH_RUNNING', () => {
    const initialState: IGraphResponse = { body: undefined, headers: undefined };
    const expectedState = initialState;

    const action = { type: QUERY_GRAPH_RUNNING, response: '' };
    const newState = graphResponse(initialState, action);
    expect(newState).toEqual(expectedState);
  })
});
