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
    width: '26%',
    height: ''
  },
  content: {
    width: '74%',
    height: '100%'
  }
};

export function dimensions(state = initialState, action: AppAction): any {
  switch (action.type) {
    case RESIZE_SUCCESS:
      return action.response;
    default:
      return state;
  }
}