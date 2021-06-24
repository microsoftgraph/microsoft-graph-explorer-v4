import { IAction } from '../../../types/action';
import {
    CHANGE_PERMISSIONS_MODE_SUCCESS
} from '../redux-constants';

export function changeMode(newPerm: boolean): IAction {
    return {
        type: CHANGE_PERMISSIONS_MODE_SUCCESS,
        response: newPerm,
    };
}