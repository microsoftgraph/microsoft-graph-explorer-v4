import { IAction } from '../../../types/action';
import { SET_TOURSTATE_SUCCESS } from '../redux-constants';

export function tourState(state = {} , action: IAction): any{
    switch(action.type){
        case SET_TOURSTATE_SUCCESS:
            return action.response
        default:
            return state
    }
}