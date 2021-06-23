import { IToggleState } from 'office-ui-fabric-react';
import { IAction } from '../../../types/action';
import {
    APPLICATION_PERMISSIONS_SUCCESS,
    APPLICATION_PERMISSIONS_FAILURE,
    DELEGATED_PERMISSIONS_SUCCESS,
    DELEGATED_PERMISSIONS_FAILED
} from '../redux-constants';

const initialState: IToggleState = {
    checked: false
}

export function togglePermissions(state = initialState, action: IAction): any {
    switch (action.type) {
        case APPLICATION_PERMISSIONS_SUCCESS:
            return {
                checked: true,
                data: action.response
            };
        case APPLICATION_PERMISSIONS_FAILURE:
            return {
                checked: true,
                data: null
            };
        case DELEGATED_PERMISSIONS_SUCCESS:
            return {
                checked: false,
                data: action.response
            };
        case DELEGATED_PERMISSIONS_FAILED:
            return {
                checked: false,
                data: null
            };
    }
}