import {
  SET_TOURSTATE_SUCCESS, SET_ACTION_TYPES_SUCCESS, SET_NEXT_TOUR_STEP_SUCCESS,
  FETCH_TOUR_STEPS_SUCCESS, FETCH_TOUR_STEPS_PENDING, FETCH_TOUR_STEPS_ERROR
} from '../redux-constants'
import { geLocale } from '../../../appLocale';
import { IRequestOptions } from '../../../types/request';
export function toggleTourState(response: object): any {
  return {
    type: SET_TOURSTATE_SUCCESS,
    response
  }
}

export function setActionTypes(response: any): any {
  return {
    type: SET_ACTION_TYPES_SUCCESS,
    response
  }
}

export function setNextTourStep(response: any): any {
  return {
    type: SET_NEXT_TOUR_STEP_SUCCESS,
    response
  }
}

export function fetchTourStepsSuccess(response: any): any {
  return {
    type: FETCH_TOUR_STEPS_SUCCESS,
    response
  }
}

export function fetchTourStepsPending(): any {
  return {
    type: FETCH_TOUR_STEPS_PENDING
  }
}

export function fetchTourStepsError(response: any): any {
  return {
    type: FETCH_TOUR_STEPS_ERROR,
    response
  }
}

export function fetchTourSteps(): Function {
  return async (dispatch: Function, getState: Function) => {
    try {
      const { devxApi } = getState();
      const tourStepsUrl = `${devxApi.baseUrl}/tourSteps`;

      const headers = {
        'Content-Type': 'application/json',
        'Accept-Language': geLocale
      }

      const options: IRequestOptions = { headers };

      // // eslint-disable-next-line max-len
      // let url = 'https://raw.githubusercontent.com/Onokaev/microsoft-graph-devx-content/dev/ge-tour/steps.json';
      // const locale = geLocale
      // if (locale !== 'en-US') {
      //   // eslint-disable-next-line max-len
      //   url = 'https://raw.githubusercontent.com/Onokaev/microsoft-graph-devx-content/dev/ge-tour/steps.json'
      // }

      dispatch(fetchTourStepsPending());

      const response = await fetch(tourStepsUrl, options);
      if (!response.ok) {
        throw response
      }
      const steps = await response.json();
      return dispatch(fetchTourStepsSuccess(steps));
    } catch (error: any) {
      return dispatch(fetchTourStepsError({ error }));
    }
  }
}