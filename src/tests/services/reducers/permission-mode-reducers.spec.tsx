import { DISPLAY_APPLICATION_PERMISSIONS, DISPLAY_DELEGATED_PERMISSIONS } from '../../../app/services/graph-constants';
import { permissionModeType } from '../../../app/services/reducers/permission-mode-reducer';
import { CHANGE_PERMISSIONS_MODE_SUCCESS } from '../../../app/services/redux-constants';

describe('Permission Mode Reducer', () => {
    it('should return initial state', () => {
        const initialState = DISPLAY_DELEGATED_PERMISSIONS;
        const dummyPermissionModeAction = { type: 'Dummy', response: false };
        const newState = permissionModeType(initialState, dummyPermissionModeAction);

        expect(newState).toEqual(initialState);
    });

    it('should handle CHANGE_PERMISSIONS_MODE_SUCCESS', () => {
        const initialState = DISPLAY_DELEGATED_PERMISSIONS;

        const permissionModeAction = { type: CHANGE_PERMISSIONS_MODE_SUCCESS, response: DISPLAY_APPLICATION_PERMISSIONS };
        const newState = permissionModeType(initialState, permissionModeAction);

        expect(newState).toEqual(DISPLAY_APPLICATION_PERMISSIONS);
    });
});
