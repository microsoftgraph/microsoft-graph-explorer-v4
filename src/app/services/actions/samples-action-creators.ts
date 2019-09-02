import { IAction } from '../../../types/action';
import { IRequestOptions } from '../../../types/request';
import { SAMPLES_FETCH_ERROR, SAMPLES_FETCH_SUCCESS } from '../redux-constants';

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

export function fetchSamples(): Function {
  return async (dispatch: Function) => {
    const samplesUrl = 'https://graphexplorerapi.azurewebsites.net/api/GraphExplorerSampless';

    const headers = {
      'Content-Type': 'application/json',
    };

    const options: IRequestOptions = { headers };

    return fetch(samplesUrl, options)
      .then(async (response) => {

        if (response.ok === false) {
          return dispatch(fetchSamplesError(response));
        }

        const queries = await response.json();
        return dispatch(fetchSamplesSuccess({
          sampleQueries: queries.sampleQueries,
        }));
      });

  };
}
