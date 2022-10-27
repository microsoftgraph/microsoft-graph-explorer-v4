import { AppAction } from '../../../types/action';
import { PERMISSIONS_PANEL_OPEN } from '../redux-constants';

export function togglePermissionsPanel(open: boolean): AppAction {
  return {
    type: PERMISSIONS_PANEL_OPEN,
    response: open
  };
}