import { IAction } from '../../../types/action';
import { GET_SNIPPET_SUCCESS } from '../redux-constants';

export function snippets(state = {}, action: IAction): any {
    switch (action.type) {
        case GET_SNIPPET_SUCCESS:
            return { ...state, ...action.response as object };
        default:
            return state;
    }
}