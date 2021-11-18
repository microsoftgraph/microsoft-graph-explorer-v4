import { IAction } from '../../../types/action';
import { PERMISSIONS_PANEL_OPEN } from '../redux-constants';

export function permissionsPanelOpen(state: boolean = false, action: IAction): any {
  switch (action.type) {
    case PERMISSIONS_PANEL_OPEN:
      return !!action.response;
    default:
      return state;
  }
}