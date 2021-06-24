import { IAction } from '../../../types/action';
import {
    CHANGE_PERMISSIONS_MODE_SUCCESS
} from '../redux-constants';

import {
    DISPLAY_DELEGATED_PERMISSIONS
} from '../graph-constants';

export function permissionModeType(state: boolean = DISPLAY_DELEGATED_PERMISSIONS, action: IAction): any {
    switch (action.type) {
        case CHANGE_PERMISSIONS_MODE_SUCCESS:
            return action.response;
        default:
            return state;
    }
}