import { IAction } from '../../../types/action';
import { IRequestOptions } from '../../../types/request';
import { SAMPLES_FETCH_ERROR, SAMPLES_FETCH_PENDING, SAMPLES_FETCH_SUCCESS } from '../redux-constants';

export function fetchSamplesSuccess(response: object): IAction {
  return {
    type: SAMPLES_FETCH_SUCCESS,
    response,
  };
}

export function fetchSamplesError(response: object): IAction {
  return {
    type: SAMPLES_FETCH_ERROR,
    response,
  };
}

export function fetchSamplesPending() {
  return {
    type: SAMPLES_FETCH_PENDING
  };
}

export function fetchSamples(): Function {
  return async (dispatch: Function) => {
    const samplesUrl = 'https://graphexplorerapi.azurewebsites.net/api/GraphExplorerSamples';

    const headers = {
      'Content-Type': 'application/json',
    };

    const options: IRequestOptions = { headers };

    dispatch(fetchSamplesPending());

    return fetch(samplesUrl, options)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        dispatch(fetchSamplesSuccess(res.sampleQueries));
        return res.products;
      })
      .catch(error => {
        dispatch(fetchSamplesError(error));
      });

  };
}
