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
import { IQuery } from '../../../types/query-runner';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
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

  it('Dispatches FETCH_ADAPTIVE_CARD_SUCCESS with no payload', () => {
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
  });

  it('Dispatches FETCH_ADAPTIVE_CARD_SUCCESS with payload', () => {
    const result = { sample: 'response' };
    const expectedAction = [
      {
        type: FETCH_ADAPTIVE_CARD_SUCCESS,
        response: {
          'Given name': 'Megan',
          'Surname': 'Bowen',
          'Job title': 'Auditor',
          'Office location': '12/1110',
          'Email': 'MeganBowen@M365x214355.onmicrosoft.com',
          'Business phones': '+1 412 555 0109'
        }
      },
      {
        type: FETCH_ADAPTIVE_CARD_PENDING,
        response: ''
      }
    ];

    const payload = {
      businessPhones: ['+1 412 555 0109'],
      displayName: 'Megan Bowen',
      givenName: 'Megan',
      jobTitle: 'Auditor',
      mail: 'MeganB@M365x214355.onmicrosoft.com',
      mobilePhone: null,
      officeLocation: '12/1110',
      preferredLanguage: 'en-US',
      surname: 'Bowen',
      userPrincipalName: 'MeganB@M365x214355.onmicrosoft.com',
      id: '48d31887-5fad-4d73-a9f5-3c356e68a038'
    }

    // eslint-disable-next-line no-undef
    fetchMock.mockResponse(JSON.stringify(result));

    const store = mockStore({});
    const sampleQuery: IQuery = {
      selectedVerb: 'GET',
      selectedVersion: 'v1',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me/',
      sampleBody: '',
      sampleHeaders: []
    }

    // @ts-ignore
    return store.dispatch(getAdaptiveCard(payload, sampleQuery))
      // @ts-ignore
      .then(() => {
        expect(store.getActions()[0].type).toEqual(expectedAction[1].type);
        expect(store.getActions()[1].type).toEqual(expectedAction[0].type);
      });
  })

  it('Returns no template available if a sample query has no adaptive card', () => {
    const result = { sample: 'response' };
    const expectedAction = {
      type: FETCH_ADAPTIVE_CARD_ERROR,
      response: 'No template available'
    };

    const payload = {
      businessPhones: ['+1 412 555 0109'],
      displayName: 'Megan Bowen',
      givenName: 'Megan',
      jobTitle: 'Auditor',
      mail: 'MeganB@M365x214355.onmicrosoft.com',
      mobilePhone: null,
      officeLocation: '12/1110',
      preferredLanguage: 'en-US',
      surname: 'Bowen',
      userPrincipalName: 'MeganB@M365x214355.onmicrosoft.com',
      id: '48d31887-5fad-4d73-a9f5-3c356e68a038'
    }

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
    return store.dispatch(getAdaptiveCard(payload, sampleQuery))
      // @ts-ignore
      .then(() => {
        expect(store.getActions()).toEqual([expectedAction]);
      });
  });

  it('Returns invalid payload for card if the payload received is an empty object', () => {
    const result = { sample: 'response' };
    const expectedAction = {
      type: FETCH_ADAPTIVE_CARD_ERROR,
      response: 'Invalid payload for card'
    };

    const payload = {};

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
    return store.dispatch(getAdaptiveCard(payload, sampleQuery))
      // @ts-ignore
      .then(() => {
        expect(store.getActions()).toEqual([expectedAction]);
      });
  });


});
