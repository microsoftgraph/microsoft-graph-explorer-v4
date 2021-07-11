import { IAction } from '../../../types/action';
import { PERMISSION_MODE_TYPE } from '../graph-constants';
import {
    CLOSE_POP_UP_SUCCESS,
    CHANGE_PERMISSIONS_MODE_SUCCESS,
    OPEN_POP_UP_SUCCESS
} from '../redux-constants';

export function changeMode(newPerm: PERMISSION_MODE_TYPE): IAction {
    return {
        type: CHANGE_PERMISSIONS_MODE_SUCCESS,
        response: newPerm,
    };
}

export function closePopUp(response: boolean): IAction {
    return {
        type: CLOSE_POP_UP_SUCCESS,
        response,
    };
}

export function openPopUp(response: boolean): IAction {
    return {
        type: OPEN_POP_UP_SUCCESS,
        response,
    };
}