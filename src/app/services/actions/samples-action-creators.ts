import { geLocale } from '../../../appLocale';
import { IAction } from '../../../types/action';
import { IRequestOptions } from '../../../types/request';
import {
  SAMPLES_FETCH_ERROR,
  SAMPLES_FETCH_PENDING,
  SAMPLES_FETCH_SUCCESS,
} from '../redux-constants';

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
    type: SAMPLES_FETCH_PENDING,
  };
}

export function fetchSamples(): Function {
  return async (dispatch: Function, getState: Function) => {
    const { devxApi } = getState();
    let samplesUrl = `${devxApi.baseUrl}/samples`;

    // This is a temporary hard code till devtest devxapi is fully functional with an Azure blob
    samplesUrl = 'https://gi21devxapi-devtest.azurewebsites.net/samples?org=LokiLabs&branchName=interns/feature/app-mode-sample-queries';


    const headers = {
      'Content-Type': 'application/json',
      'Accept-Language': geLocale,
    };

    const options: IRequestOptions = { headers };

    dispatch(fetchSamplesPending());

    try {
      const response = await fetch(samplesUrl, options);
      if (!response.ok) {
        throw response;
      }
      const res = await response.json();
      return dispatch(fetchSamplesSuccess(res));
    } catch (error) {
      return dispatch(fetchSamplesError({ error }));
    }
  };
}
