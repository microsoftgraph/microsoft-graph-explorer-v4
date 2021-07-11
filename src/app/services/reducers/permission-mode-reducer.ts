import { IAction } from '../../../types/action';
import {
    CHANGE_PERMISSIONS_MODE_SUCCESS,
    CLOSE_POP_UP_SUCCESS,
    OPEN_POP_UP_SUCCESS
} from '../redux-constants';

import {
    PERMISSION_MODE_TYPE
} from '../graph-constants';

export function permissionModeType(state: PERMISSION_MODE_TYPE = PERMISSION_MODE_TYPE.User, action: IAction): any {
    switch (action.type) {
        case CHANGE_PERMISSIONS_MODE_SUCCESS:
            return action.response;
        default:
            return state;
    }
}

export function hideDialog(state: boolean = false, action: IAction): any {
    switch (action.type) {
        case CLOSE_POP_UP_SUCCESS:
            return action.response
        case OPEN_POP_UP_SUCCESS:
            return action.response
        default:
            return state;
    }
}