import { IAction } from '../../../types/action';
import { ITour } from '../../../types/tour';
import { SET_ACTION_TYPES_SUCCESS, SET_NEXT_TOUR_STEP_SUCCESS, SET_TOURSTATE_SUCCESS } from '../redux-constants';

const initialState: ITour = {
  isRunning: false,
  beginner: true,
  continuous: true,
  actionType: '',
  step: 0
}
export function tour(state: ITour = initialState, action: IAction): any {
  switch (action.type) {
    case SET_TOURSTATE_SUCCESS:
      return action.response
    case SET_NEXT_TOUR_STEP_SUCCESS:
      return { ...state, step: action.response }
    case SET_ACTION_TYPES_SUCCESS:
      return { ...state, actionType: action.response }
    default:
      return state
  }
}