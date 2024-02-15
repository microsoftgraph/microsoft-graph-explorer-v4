import {
  fetchSamplesSuccess, fetchSamplesError,
  fetchSamplesPending
} from './samples-action-creators';
import {
  SAMPLES_FETCH_SUCCESS, SAMPLES_FETCH_PENDING, SAMPLES_FETCH_ERROR
} from '../redux-constants';
import { AppAction } from '../../../types/action';

describe('Samples action creators', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should dispatch SAMPLES_FETCH_SUCCESS when fetchSamplesSuccess() is called', () => {

    const response = fetchMock.mockResponseOnce(JSON.stringify({ ok: true }));
    const expectedAction: AppAction = {
      type: SAMPLES_FETCH_SUCCESS,
      response
    };

    const action = fetchSamplesSuccess(response);
    expect(action).toEqual(expectedAction);
  });

  it('should dispatch SAMPLES_FETCH_PENDING when fetchSamplesPending() is called', () => {
    const expectedAction: AppAction = {
      type: SAMPLES_FETCH_PENDING,
      response: null
    };

    const action = fetchSamplesPending();
    expect(action).toEqual(expectedAction);
  })

  it('should dispatch SAMPLES_FETCH_ERROR when fetchSamplesError() is called', () => {
    const response = new Error('error');
    const expectedAction: AppAction = {
      type: SAMPLES_FETCH_ERROR,
      response
    };

    const action = fetchSamplesError(response);
    expect(action).toEqual(expectedAction);
  });

});
