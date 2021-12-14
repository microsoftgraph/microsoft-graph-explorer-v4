import {
  getAdaptiveCard,
  getAdaptiveCardError,
  getAdaptiveCardPending,
  getAdaptiveCardSuccess
} from '../../../app/services/actions/adaptive-cards-action-creator';
import {
  FETCH_ADAPTIVE_CARD_ERROR,
  FETCH_ADAPTIVE_CARD_PENDING,
  FETCH_ADAPTIVE_CARD_SUCCESS
} from '../../../app/services/redux-constants';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetch from 'jest-fetch-mock';
import { IQuery } from '../../../types/query-runner';
const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Graph Explorer Adaptive Cards Action Creators\'', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    fetchMock.resetMocks();
  });

  it('creates ADAPTIVE_FETCH_SUCCESS when getAdaptiveCardSuccess is called', () => {

    const result = { sample: 'response' };
    const expectedAction = {
      type: FETCH_ADAPTIVE_CARD_SUCCESS,
      response: result
    };

    const action = getAdaptiveCardSuccess(result);
    expect(action).toEqual(expectedAction);

  });

  it('creates ADAPTIVE_FETCH_PENDING when getAdaptiveCardPending is called', () => {

    const expectedAction = {
      type: FETCH_ADAPTIVE_CARD_PENDING,
      response: ''
    };

    const action = getAdaptiveCardPending();
    expect(action).toEqual(expectedAction);

  });

  it('creates ADAPTIVE_FETCH_ERROR when getAdaptiveCardError is called', () => {

    const error = 'sample error';
    const expectedAction = {
      type: FETCH_ADAPTIVE_CARD_ERROR,
      response: error
    };

    const action = getAdaptiveCardError(error);
    expect(action).toEqual(expectedAction);

  });

  it('Retrieves an adaptive card response', () => {
    const result = { sample: 'response' };
    const expectedAction = {
      type: FETCH_ADAPTIVE_CARD_SUCCESS,
      response: {}
    };

    // eslint-disable-next-line no-undef
    fetchMock.mockResponse(JSON.stringify(result));

    const store = mockStore({});
    const sampleQuery: IQuery = {
      selectedVerb: 'GET',
      selectedVersion: 'v1',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me/events',
      sampleBody: '',
      sampleHeaders: []
    }

    // @ts-ignore
    return store.dispatch(getAdaptiveCard('', sampleQuery))
      // @ts-ignore
      .then(() => {
        expect(store.getActions()).toEqual([expectedAction]);
      });
  })

});
