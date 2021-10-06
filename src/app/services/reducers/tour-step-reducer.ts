import { IAction } from '../../../types/action';
import { SET_NEXT_TOUR_STEP_SUCCESS } from '../redux-constants';

export function setNextTourStep(state = [], action: IAction) {
    switch (action.type) {
        case SET_NEXT_TOUR_STEP_SUCCESS:
            return action.response;
        default:
            return state;
    }
}