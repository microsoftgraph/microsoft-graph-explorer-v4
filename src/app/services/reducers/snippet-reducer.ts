import { AppAction } from '../../../types/action';
import {
  GET_SNIPPET_ERROR, GET_SNIPPET_PENDING, GET_SNIPPET_SUCCESS,
  SET_SNIPPET_TAB_SUCCESS
} from '../redux-constants';
import { ISnippet } from '../../../types/snippets';

const initialState: ISnippet = {
  pending: false,
  data: {},
  error: null,
  snippetTab: 'csharp'
};

export function snippets(state = initialState, action: AppAction): any {
  switch (action.type) {
    case GET_SNIPPET_SUCCESS:
      return {
        ...state,
        pending: false,
        data: action.response as object,
        error: null
      };
    case GET_SNIPPET_ERROR:
      return {
        ...state,
        pending: false,
        data: null,
        error: action.response as object
      };
    case GET_SNIPPET_PENDING:
      return {
        ...state,
        pending: true,
        data: null,
        error: null
      };
    case SET_SNIPPET_TAB_SUCCESS:
      return {
        ...state,
        snippetTab: action.response
      }
    default:
      return state;
  }
}