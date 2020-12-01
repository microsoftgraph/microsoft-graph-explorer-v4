import { IAction } from '../../../types/action';
import { IDimensions } from '../../../types/dimensions';
import { RESIZE_SUCCESS } from '../redux-constants';

const initialState: IDimensions = {
    sidebar: {
        width: `27%`,
        height: '98%',
    },
    content: {
        width: `61%`,
        height: '98%',
    },
    request: {
        width: `100%`,
        height: '40vh',
    },
    response: {
        width: `100%`,
        height: '62vh',
    },
};

export function dimensions(state = initialState, action: IAction): any {
    switch (action.type) {
        case RESIZE_SUCCESS:
            return action.response;
        default:
            return state;
    }
}