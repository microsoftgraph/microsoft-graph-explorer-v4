import { IAction } from '../../../types/action';
import { IDimensions } from '../../../types/dimensions';
import { RESIZE_SUCCESS } from '../redux-constants';

const initialState: IDimensions = {
  request: {
    width: '100%',
    height: '35%'
  },
  response: {
    width: '100%',
    height: '60%'
  },
  sidebar: {
    width: '26%',
    height: '100%'
  },
  content: {
    width: '72%',
    height: '100%'
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