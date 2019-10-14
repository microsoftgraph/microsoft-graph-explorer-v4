import { sampleQuery, selectedVersion } from '../../../app/services/reducers/query-input-reducers';
import { SELECT_VERSION_SUCCESS, SET_SAMPLE_QUERY_SUCCESS } from '../../../app/services/redux-constants';

describe('Query INput Reducer', () => {
  it('should return initial state', () => {
    const initialState = {};
    const dummyAction = {
      type: 'Dummy', response: {
        selectedVerb: 'GET',
        sampleUrl: 'https://graph.microsoft.com/v1.0/me/'
      }
    };
    const newState = sampleQuery(initialState, dummyAction);

    expect(newState).toEqual(initialState);
  });

  it('should handle SET_SAMPLE_QUERY_SUCCESS', () => {
    const initialState = {};

    const query = {
      selectedVerb: 'GET',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me/'
    };

    const action = {
      type: SET_SAMPLE_QUERY_SUCCESS, response: query
    };

    const newState = sampleQuery(initialState, action);

    expect(newState).toEqual(query);
  });

  it('should handle SELECT_VERSION_SUCCESS', () => {
    const initialState = {};

    const version = 'beta';

    const action = {
      type: SELECT_VERSION_SUCCESS, response: 'beta'
    };

    const newState = selectedVersion(initialState, action);

    expect(newState).toEqual(version);
  });
});
