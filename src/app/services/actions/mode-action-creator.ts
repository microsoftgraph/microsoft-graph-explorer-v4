import { IAction } from '../../../types/action';
import { Dispatch } from 'redux';
import {
    CHANGE_PERMISSIONS_MODE_SUCCESS
} from '../redux-constants';


export function changeMode(newPerm: boolean): IAction {
    console.log("YWEEETE");
    return {
        type: CHANGE_PERMISSIONS_MODE_SUCCESS,
        response: newPerm,
    };
    // return (dispatch: Dispatch) => {
    //     dispatch(switchModeSuccess(newPerm));
    // };
}


export function switchModeSuccess(newPerm: boolean): IAction {
    console.log("YWEEETE");
    return {
        type: CHANGE_PERMISSIONS_MODE_SUCCESS,
        response: newPerm,
    };
}

