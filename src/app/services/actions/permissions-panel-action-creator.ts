import { PERMISSIONS_PANEL_OPEN } from '../redux-constants';

export function togglePermissionsPanel(open: boolean): any {
    return {
        type: PERMISSIONS_PANEL_OPEN,
        response: open,
    };
}