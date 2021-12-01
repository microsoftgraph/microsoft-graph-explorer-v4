import { fetchResourcesSuccess } from '../../../app/services/actions/resource-explorer-action-creators';
import {
  FETCH_RESOURCES_SUCCESS
} from '../../../app/services/redux-constants';


describe('Resource Explorer actions', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('creates FETCH_RESOURCES_SUCCESS when fetchResourcesSuccess is called', () => {

    const response = fetchMock.mockResponseOnce(JSON.stringify({ ok: true }));
    const expectedAction = {
      type: FETCH_RESOURCES_SUCCESS,
      response
    };

    const action = fetchResourcesSuccess(response);
    expect(action).toEqual(expectedAction);
  });

});
