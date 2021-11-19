import { IAction } from '../../../types/action';
import { IDimensions } from '../../../types/dimensions';
import { RESIZE_SUCCESS } from '../redux-constants';

export function setDimensions(response: IDimensions): IAction {
  return {
    type: RESIZE_SUCCESS,
    response
  };
}
