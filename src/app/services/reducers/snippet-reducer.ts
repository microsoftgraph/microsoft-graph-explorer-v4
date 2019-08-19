import { IAction } from '../../../types/action';
import { GET_SNIPPET_SUCCESS } from '../redux-constants';

// TODO: Specify type of action
export function snippets(state = {}, action: any): any {
    switch (action.type) {
        case GET_SNIPPET_SUCCESS:
            return { ...state, ...action.response };
        default:
            return state;
    }
}