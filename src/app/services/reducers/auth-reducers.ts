import { IAction } from '../../../types/action';
import { GET_AUTH_TOKEN_SUCCESS, LOGOUT_SUCCESS } from '../redux-constants';

export function authToken(state = {}, action: IAction): string|object {
    switch (action.type) {
        case GET_AUTH_TOKEN_SUCCESS:
            return action.response;
        case LOGOUT_SUCCESS:
            return action.response;
        default:
            return state;
    }
}
