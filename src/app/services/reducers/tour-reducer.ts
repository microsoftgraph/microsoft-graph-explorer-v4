import { IAction } from '../../../types/action';
import { ITour } from '../../../types/tour';
import {
  FETCH_TOUR_STEPS_ERROR,
  FETCH_TOUR_STEPS_PENDING,
  FETCH_TOUR_STEPS_SUCCESS, SET_ACTION_TYPES_SUCCESS,
  SET_NEXT_TOUR_STEP_SUCCESS, SET_TOURSTATE_SUCCESS
} from '../redux-constants';
import { TourSteps } from '../../views/tour/utils/steps'

const initialState = {
  isRunning: false,
  beginner: true,
  continuous: true,
  actionType: '',
  step: 0,
  tourSteps: [],
  pending: false,
  error: null
}
export function tour(state: ITour = initialState, action: IAction): any {
  switch (action.type) {
    case SET_TOURSTATE_SUCCESS:
      return {
        ...state,
        ...action.response
      }
    case SET_NEXT_TOUR_STEP_SUCCESS:
      return {
        ...state,
        step: action.response,
        pending: false
      }
    case SET_ACTION_TYPES_SUCCESS:
      return {
        ...state,
        actionType: action.response,
        pending: false
      }
    case FETCH_TOUR_STEPS_SUCCESS:
      return {
        ...state,
        tourSteps: action.response,
        pending: false
      }
    case FETCH_TOUR_STEPS_PENDING:
      return {
        ...state,
        pending: true
      }
    case FETCH_TOUR_STEPS_ERROR:
      return {
        ...state,
        error: action.response,
        tourSteps: TourSteps
      }
    default:
      return state
  }
}