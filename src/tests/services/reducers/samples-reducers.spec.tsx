import { clearQueryError } from '../../../app/services/actions/error-action-creator';
import { queryRunnerError } from '../../../app/services/reducers/query-runner-error';
import { samples } from '../../../app/services/reducers/samples-reducers';
import { CLEAR_QUERY_ERROR, SAMPLES_FETCH_ERROR, SAMPLES_FETCH_SUCCESS } from '../../../app/services/redux-constants';
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

    const queryAction = { type: SAMPLES_FETCH_ERROR, response: mockResponse };
    const state = samples(initialState, queryAction);

    expect(state).toEqual(newState);
  });

});
