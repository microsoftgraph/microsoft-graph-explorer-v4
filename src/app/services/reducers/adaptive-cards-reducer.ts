import { IAction } from '../../../types/action';
import { ADAPTIVE_FETCH_ERROR, ADAPTIVE_FETCH_PENDING, ADAPTIVE_FETCH_SUCCESS } from '../redux-constants';

const initialState = {
    pending: false,
    data: ''
};

export function adaptiveCard(state = initialState, action: IAction): any {
    switch (action.type) {
        case ADAPTIVE_FETCH_SUCCESS:
            return {
                pending: false,
                data: action.response
            };
        case ADAPTIVE_FETCH_PENDING:
            return {
                pending: true,
                data: null
            };
        case ADAPTIVE_FETCH_ERROR:
            return {
                pending: false,
                data: null
        };
        default:
            return state;
    }
}