import { IAction } from "../../../types/action";
import { IRequestOptions } from '../../../types/request';
import {
    GET_POLICY_ERROR,
    GET_POLICY_PENDING,
    GET_POLICY_SUCCESS,
    POST_ACKNOWLEDGE_SUCCESS,
    POST_ACKNOWLEDGE_ERROR
} from "../redux-constants";

export function getPolicySuccess(response: string): IAction {
    return {
        type: GET_POLICY_SUCCESS,
        response,
    };
}

export function getPolicyError(response: object): IAction {
    return {
        type: GET_POLICY_ERROR,
        response,
    };
}

export function getPolicyPending(): any {
    return {
        type: GET_POLICY_PENDING,
    };
}

export function postAcknowledgeSuccess(): any {
    return {
        type: POST_ACKNOWLEDGE_SUCCESS,
    };
}
export function postAcknowledgeError(response: object): IAction {
    return {
        type: POST_ACKNOWLEDGE_ERROR,
        response
    };
}

// TODO: Test this function
export function getPolicy(): Function {
    return async (dispatch: Function) => {
        const policyUrl = 'https://clients.config.office.net/user/v1.0/web/policies';

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': '', //TODO: Add token
            'x-Cid': '' //TODO: Add a random GUID
        };
        const options: IRequestOptions = { headers };
        dispatch(getPolicyPending());

        try {
            const response = await fetch(policyUrl, options);
            if (!response.ok) {
                throw response;
            }
            const res = await response.json();
            acknowledgeCall(policyUrl, headers);
            return dispatch(getPolicySuccess(res.valueName)); // TODO: confirm if value is the correct field needed
        } catch (error) {
            return dispatch(getPolicyError({ error }));
        }
    }
}

// TODO: Test this function
export function acknowledgeCall(policyUrl: string, headers: {}): Function {
    return async (dispatch: Function) => {
        const body = {
            'deviceName': '',
            'devicePlatform': '',
            'sdkVersion': '',
            'lastStatus': false, // boolean
            'lastTaskErrorMessage': '',
            'lastTaskName': '',
        };
        const method = 'POST';

        const options: any = { method, headers, body };
        try {
            const response: Response = await fetch(policyUrl, options);
            if (response.ok) {
                dispatch(postAcknowledgeSuccess()); // Not sure if the response is an ok, confirm this
            }
        } catch (error) {
            return dispatch(postAcknowledgeError({ error }));
        }
    }
}