import { PERMISSION_MODE_TYPE } from '../../../app/services/graph-constants';
import { permissionModeType } from '../../../app/services/reducers/permission-mode-reducer';
import { CHANGE_PERMISSIONS_MODE_SUCCESS } from '../../../app/services/redux-constants';

describe('Permission Mode Reducer', () => {
    it('should return initial state', () => {
        const initialState = PERMISSION_MODE_TYPE.User;
        const dummyPermissionModeAction = { 
            type: 'Dummy', 
            response: false 
        };
        const newState = permissionModeType(initialState, dummyPermissionModeAction);
        expect(newState).toEqual(initialState);
    });

    it('should handle CHANGE_PERMISSIONS_MODE_SUCCESS', () => {
        const initialState = PERMISSION_MODE_TYPE.User;
        const permissionModeAction = { 
            type: CHANGE_PERMISSIONS_MODE_SUCCESS, 
            response: PERMISSION_MODE_TYPE.TeamsApp 
        };
        const newState = permissionModeType(initialState, permissionModeAction);
        expect(newState).toEqual(PERMISSION_MODE_TYPE.TeamsApp);
    });
});
