import { AppAction } from '../../../types/action';
import { IDimensions } from '../../../types/dimensions';
import { RESIZE_SUCCESS } from '../redux-constants';

export function setDimensions(response: IDimensions): AppAction {
  return {
    type: RESIZE_SUCCESS,
    response
  };
}
