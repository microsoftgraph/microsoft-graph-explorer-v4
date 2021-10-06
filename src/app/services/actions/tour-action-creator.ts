import { SET_TOURSTATE_SUCCESS, SET_ACTION_TYPES_SUCCESS, SET_NEXT_TOUR_STEP_SUCCESS } from '../redux-constants'
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