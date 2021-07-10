import { IAction } from '../../../types/action';
import {
    APP_POP_UP_SUCCESS,
    CHANGE_PERMISSIONS_MODE_SUCCESS
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

export function popUp(state: boolean = false, action: IAction): any {
    switch (action.type) {
        case APP_POP_UP_SUCCESS:
            return action.response
        default:
            return state;
    }
}