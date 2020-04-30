import { IAction } from '../../../types/action';
import { GET_SNIPPET_ERROR, GET_SNIPPET_PENDING, GET_SNIPPET_SUCCESS } from '../redux-constants';

const initialState = {
    pending: false,
    data: {},
    error: null
  };
export function snippets(state = initialState, action: IAction): any {
    switch (action.type) {
        case GET_SNIPPET_SUCCESS:
            return {
                pending: false,
                data: action.response as object,
                error: null
             };
        case GET_SNIPPET_ERROR:
            return {
                pending: false,
                data: null,
                error: action.response as object
             };
        case GET_SNIPPET_PENDING:
            return {
                pending: true,
                data: null,
                error: null
            };
        default:
            return state;
    }
}