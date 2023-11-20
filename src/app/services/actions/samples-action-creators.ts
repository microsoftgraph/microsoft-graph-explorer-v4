import { samplesCache } from '../../../modules/cache/samples.cache';
import { AppDispatch } from '../../../store';
import { AppAction } from '../../../types/action';
import { IRequestOptions } from '../../../types/request';
import { queries } from '../../views/sidebar/sample-queries/queries';
import {
  SAMPLES_FETCH_ERROR,
  SAMPLES_FETCH_PENDING,
  SAMPLES_FETCH_SUCCESS
} from '../redux-constants';

export function fetchSamplesSuccess(response: object): AppAction {
  return {
    type: SAMPLES_FETCH_SUCCESS,
    response
  };
}

export function fetchSamplesError(response: object): AppAction {
  return {
    type: SAMPLES_FETCH_ERROR,
    response
  };
}

export function fetchSamplesPending(): AppAction {
  return {
    type: SAMPLES_FETCH_PENDING,
    response: null
  };
}

export function fetchSamples() {
  return async (dispatch: AppDispatch, getState: Function) => {
    const { devxApi } = getState();
    let samplesUrl = `${devxApi.baseUrl}/samples`;

    samplesUrl = devxApi.parameters
      ? `${samplesUrl}?${devxApi.parameters}`
      : `${samplesUrl}`;

    const headers = {
      'Content-Type': 'application/json'
    };

    const options: IRequestOptions = { headers };

    dispatch(fetchSamplesPending());

    try {
      const response = await fetch(samplesUrl, options);
      if (!response.ok) {
        throw response;
      }
      const res = await response.json();
      return dispatch(fetchSamplesSuccess(res.sampleQueries));
    } catch (error) {
      let cachedSamples = await samplesCache.readSamples();
      if (cachedSamples.length === 0) {
        cachedSamples = queries;
      }
      return dispatch(fetchSamplesError(cachedSamples));
    }
  };
}
