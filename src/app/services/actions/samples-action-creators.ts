import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { geLocale } from '../../../appLocale';
import { componentNames, errorTypes, telemetry } from '../../../telemetry';
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

export function fetchSamplesPending(): any {
  return {
    type: SAMPLES_FETCH_PENDING
  };
}

export function fetchSamples(): Function {
  return async (dispatch: Function, getState: Function) => {
    const { devxApi } = getState();
    let samplesUrl = `${devxApi.baseUrl}/samples`;

    samplesUrl = (devxApi.parameters) ? `${samplesUrl}?${devxApi.parameters}` : `${samplesUrl}`;

    const headers = {
      'Content-Type': 'application/json',
      'Accept-Language': geLocale
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
      telemetry.trackException(
        new Error(errorTypes.NETWORK_ERROR),
        SeverityLevel.Error,
        {
          ComponentName: componentNames.FETCH_SAMPLES_ACTION,
          Message: `${error}`
        });
      return dispatch(fetchSamplesError({ error }));
    }
  };
}
