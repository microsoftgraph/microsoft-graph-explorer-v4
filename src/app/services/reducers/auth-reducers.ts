import { IAction } from '../../../types/action';
import { IAuthenticateResult } from '../../../types/authentication';
import {
    AUTHENTICATION_PENDING, GET_AUTH_TOKEN_SUCCESS,
    GET_CONSENTED_SCOPES_SUCCESS, LOGOUT_SUCCESS
} from '../redux-constants';


const initialState: IAuthenticateResult = {
    pending: false,
    token: false
}

export function authToken(state = initialState, action: IAction): IAuthenticateResult {
    switch (action.type) {
        case GET_AUTH_TOKEN_SUCCESS:
            return {
                token: true,
                pending: false
            };
        case LOGOUT_SUCCESS:
            return {
                token: false,
                pending: false
            };
        case AUTHENTICATION_PENDING:
            return {
                token: true,
                pending: true
            };
        default:
            return state;
    }
}

export function consentedScopes(state: string[] = [], action: IAction): any {
    switch (action.type) {
        case GET_CONSENTED_SCOPES_SUCCESS:
            return action.response;
        case LOGOUT_SUCCESS:
            return action.response;
        default:
            return state;
    }
}
