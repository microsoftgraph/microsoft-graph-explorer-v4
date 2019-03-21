import { IAction } from '../../../types/action';
import { AUTHENTICATE_USER } from '../constants';

export function authResponse(state = {}, action: IAction) {
    switch (action.type) {
        case AUTHENTICATE_USER:
        return {...state, authenticated: action.response};
        default:
            return state;
    }
}
