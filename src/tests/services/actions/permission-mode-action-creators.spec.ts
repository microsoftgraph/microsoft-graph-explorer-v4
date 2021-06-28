import { changeMode } from '../../../app/services/actions/permission-mode-action-creator';
import { DISPLAY_APPLICATION_PERMISSIONS, DISPLAY_DELEGATED_PERMISSIONS } from '../../../app/services/graph-constants';
import { CHANGE_PERMISSIONS_MODE_SUCCESS } from '../../../app/services/redux-constants';


describe('Graph Explorer Permission mode creator\'', () => {
    beforeEach(() => {
        // eslint-disable-next-line no-undef
        fetchMock.resetMocks();
    });

    it('creates CHANGE_PERMISSIONS_MODE_SUCCESS when changeMode is called with DISPLAY_APPLICATION_PERMISSIONS', () => {

        const perm = DISPLAY_APPLICATION_PERMISSIONS;
        const expectedAction = {
            type: CHANGE_PERMISSIONS_MODE_SUCCESS,
            response: DISPLAY_APPLICATION_PERMISSIONS,
        };

        const action = changeMode(perm);
        expect(action).toEqual(expectedAction);

    });

    it('creates CHANGE_PERMISSIONS_MODE_SUCCESS when changeMode is called with DISPLAY_DELEGATED_PERMISSIONS', () => {

        const perm = DISPLAY_DELEGATED_PERMISSIONS;
        const expectedAction = {
            type: CHANGE_PERMISSIONS_MODE_SUCCESS,
            response: DISPLAY_DELEGATED_PERMISSIONS,
        };

        const action = changeMode(perm);
        expect(action).toEqual(expectedAction);

    });
});
