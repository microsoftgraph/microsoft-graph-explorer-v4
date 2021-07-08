import { changeMode } from '../../../app/services/actions/permission-mode-action-creator';
import { PERMISSION_MODE_TYPE } from '../../../app/services/graph-constants';
import { CHANGE_PERMISSIONS_MODE_SUCCESS } from '../../../app/services/redux-constants';


describe('Graph Explorer Permission mode creator\'', () => {
    beforeEach(() => {
        // eslint-disable-next-line no-undef
        fetchMock.resetMocks();
    });

    it('creates CHANGE_PERMISSIONS_MODE_SUCCESS when changeMode is called with PERMISSION_MODE_TYPE.TeamsApp', () => {

        const perm = PERMISSION_MODE_TYPE.TeamsApp;
        const expectedAction = {
            type: CHANGE_PERMISSIONS_MODE_SUCCESS,
            response: PERMISSION_MODE_TYPE.TeamsApp,
        };

        const action = changeMode(perm);
        expect(action).toEqual(expectedAction);

    });

    it('creates CHANGE_PERMISSIONS_MODE_SUCCESS when changeMode is called with PERMISSION_MODE_TYPE.User', () => {

        const perm = PERMISSION_MODE_TYPE.User;
        const expectedAction = {
            type: CHANGE_PERMISSIONS_MODE_SUCCESS,
            response: PERMISSION_MODE_TYPE.User,
        };

        const action = changeMode(perm);
        expect(action).toEqual(expectedAction);

    });
});
