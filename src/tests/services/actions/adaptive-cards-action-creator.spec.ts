import {
  getAdaptiveCard, getAdaptiveCardError,
  getAdaptiveCardPending,
  getAdaptiveCardSuccess
} from '../../../app/services/actions/adaptive-cards-action-creator';
import {
  ADAPTIVE_FETCH_ERROR,
  ADAPTIVE_FETCH_PENDING,
  ADAPTIVE_FETCH_SUCCESS
} from '../../../app/services/redux-constants';


describe('Graph Explorer Adaptive Cards Action Creators\'', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    fetchMock.resetMocks();
  });

  it('creates ADAPTIVE_FETCH_SUCCESS when getAdaptiveCardSuccess is called', () => {

    const result = 'sample response';
    const expectedAction = {
      type: ADAPTIVE_FETCH_SUCCESS,
      response: result
    };

    const action = getAdaptiveCardSuccess(result);
    expect(action).toEqual(expectedAction);

  });

  it('creates ADAPTIVE_FETCH_PENDING when getAdaptiveCardPending is called', () => {

    const expectedAction = {
      type: ADAPTIVE_FETCH_PENDING,
      response: ''
    };

    const action = getAdaptiveCardPending();
    expect(action).toEqual(expectedAction);

  });

  it('creates ADAPTIVE_FETCH_ERROR when getAdaptiveCardError is called', () => {

    const error = 'sample error';
    const expectedAction = {
      type: ADAPTIVE_FETCH_ERROR,
      response: error
    };

    const action = getAdaptiveCardError(error);
    expect(action).toEqual(expectedAction);

  });

});
