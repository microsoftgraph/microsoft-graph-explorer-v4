import { fetchSamplesSuccess } from '../../../app/services/actions/samples-action-creators';
import {
  SAMPLES_FETCH_SUCCESS
} from '../../../app/services/redux-constants';


describe('actions', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('creates SAMPLES_FETCH_SUCCESS when fetchSamplesSuccess is called', () => {

    const response = fetchMock.mockResponseOnce(JSON.stringify({ ok: true }));
    const expectedAction = {
      type: SAMPLES_FETCH_SUCCESS,
      response
    };

    const action = fetchSamplesSuccess(response);
    expect(action).toEqual(expectedAction);
  });

});
