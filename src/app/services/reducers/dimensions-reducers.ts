import { IAction } from '../../../types/action';
import { IDimensions } from '../../../types/dimensions';
import { RESIZE_SUCCESS } from '../redux-constants';

const initialState: IDimensions = {
  request: {
    width: '100%',
    height: '36vh'
  },
  response: {
    width: '100%',
    height: '62vh'
  },
  sidebar: {
    width: '26%',
    height: '98vh'
  },
  content: {
    width: '72%',
    height: '98vh'
  }
};

export function dimensions(state = initialState, action: IAction): any {
  switch (action.type) {
    case RESIZE_SUCCESS:
      return action.response;
    default:
      return state;
  }
}