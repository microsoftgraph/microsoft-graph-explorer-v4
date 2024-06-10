import { AppAction } from '../../../types/action';
import { IDimensions } from '../../../types/dimensions';
import { RESIZE_SUCCESS } from '../redux-constants';

const initialState: IDimensions = {
  request: {
    width: '100%',
    height: '38vh'
  },
  response: {
    width: '100%',
    height: '50vh'
  },
  sidebar: {
    width: '28%',
    height: ''
  },
  content: {
    width: '72%',
    height: '100%'
  }
};

export function dimensions(state = initialState, action: AppAction): IDimensions {
  switch (action.type) {

    case RESIZE_SUCCESS:
      return {
        ...state,
        request: {
          width: action.response.request.width,
          height: action.response.request.height
        },
        response: {
          width: action.response.response.width,
          height: action.response.response.height
        },
        sidebar: {
          width: action.response.sidebar.width,
          height: action.response.sidebar.height
        },
        content: {
          width: action.response.content.width,
          height: action.response.content.height
        }
      };
    default:
      return state;
  }
}