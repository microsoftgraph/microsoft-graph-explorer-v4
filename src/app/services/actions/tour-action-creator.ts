import { SET_TOURSTATE_SUCCESS } from '../redux-constants'
export function toggleTourState(response: object): any {
  return {
    type: SET_TOURSTATE_SUCCESS,
    response
  }
}