import { IAction } from "../../../types/action";
import { IPolicies } from "../../../types/ocps-api";
import { GET_POLICY_ERROR, GET_POLICY_PENDING, GET_POLICY_SUCCESS } from "../redux-constants";

const initialState: IPolicies = {
    pending: false,
    data: {},
    error: null
};

export function policies(state = initialState, action: IAction): any {
    switch (action.type) {
        case GET_POLICY_SUCCESS:
            return {
                pending: false,
                data: action.response as object,
                error: null
            };
        case GET_POLICY_ERROR:
            return {
                pending: false,
                data: null,
                error: action.response as object
            };
        case GET_POLICY_PENDING:
            return {
                pending: true,
                data: null,
                error: null
            };
        default:
            return state;
    }
}
