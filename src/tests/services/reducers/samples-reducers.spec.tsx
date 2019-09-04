import { samples } from '../../../app/services/reducers/samples-reducers';
import { SAMPLES_FETCH_ERROR, SAMPLES_FETCH_PENDING,
  SAMPLES_FETCH_SUCCESS } from '../../../app/services/redux-constants';
import { queries } from '../../../app/views/sidebar/sample-queries/queries';
import { ISampleQuery } from '../../../types/query-runner';

describe('Samples Reducer', () => {
  it('should return initial state', () => {
    const initialState: any = {
      pending: false,
      queries: [],
      error: null
    };
    const dummyAction = { type: 'Dummy', response: { dummy: 'Dummy' } };
    const newState = samples(initialState, dummyAction);

    expect(newState).toEqual(initialState);
  });

  it('should handle SAMPLES_FETCH_SUCCESS', () => {
    const initialState: any = {
      pending: false,
      queries: [],
      error: null
    };

    const sampleQueries: ISampleQuery[] =
      [
        {
          'category': 'Getting Started',
          'method': 'GET',
          'humanName': 'my profile',
          'requestUrl': '/v1.0/me/',
          'docLink': 'https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/resources/users',
          'skipTest': false
        }
      ];

    const newState = {...initialState};
    newState.queries = sampleQueries;

    const queryAction = { type: SAMPLES_FETCH_SUCCESS, response: sampleQueries };
    const state = samples(initialState, queryAction);

    expect(state).toEqual(newState);
  });

  it('should handle SAMPLES_FETCH_ERROR', () => {
    const initialState: any = {
      pending: false,
      queries: [],
      error: null
    };

    const mockResponse = {
      status: 400
    };

    const newState = { ...initialState };
    newState.error = mockResponse;
    newState.queries = queries;

    const queryAction = { type: SAMPLES_FETCH_ERROR, response: mockResponse };
    const state = samples(initialState, queryAction);

    expect(state).toEqual(newState);
  });

  it('should handle SAMPLES_FETCH_PENDING', () => {
    const initialState: any = {
      pending: false,
      queries: [],
      error: null
    };

    const isQueryRunning = true;

    const newState = { ...initialState };
    newState.pending = isQueryRunning;

    const queryAction = { type: SAMPLES_FETCH_PENDING, response: isQueryRunning };
    const state = samples(initialState, queryAction);

    expect(state).toEqual(newState);
  });

});
