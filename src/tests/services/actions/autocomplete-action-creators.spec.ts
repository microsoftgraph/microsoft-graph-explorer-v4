import {
  AUTOCOMPLETE_FETCH_ERROR,
  AUTOCOMPLETE_FETCH_PENDING,
  AUTOCOMPLETE_FETCH_SUCCESS
} from '../../../app/services/redux-constants'
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetch from 'jest-fetch-mock';

import {
  fetchAutocompleteSuccess, fetchAutocompleteError,
  fetchAutocompletePending, fetchAutoCompleteOptions
} from '../../../app/services/actions/autocomplete-action-creators';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);
describe('Test autocomplete action creators', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    fetchMock.resetMocks();
  });

  it('Tests autocomplete error', () => {
    // Arrange
    const errorObject = {};
    const expectedAction = {
      type: AUTOCOMPLETE_FETCH_ERROR,
      response: errorObject
    }

    // Act
    const action = fetchAutocompleteError(errorObject);

    // Assert
    expect(action).toEqual(expectedAction)
  })

  it('Tests autocomplete fetch success', () => {
    // Arrange
    const response = {
      url: 'https://graph.microsoft.com/v1.0/',
      parameters: {
        verb: 'GET',
        values: [],
        links: []
      },
      createdAt: ''
    }
    const expectedAction = {
      type: AUTOCOMPLETE_FETCH_SUCCESS,
      response
    }

    // Act
    const action = fetchAutocompleteSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('Tests autocomplete fetch pending', () => {
    // Arrange
    const expectedAction = {
      type: AUTOCOMPLETE_FETCH_PENDING
    }

    // Act
    const action = fetchAutocompletePending();

    // Assert
    expect(action).toEqual(expectedAction);
  })

  // Fix the thunk call

  describe('Load autocomplete suggestions thunk', () => {
    it('Should begin the api call and pull autocomplete suggestions, but fails and returns an empty array ', () => {
      // Arrange
      const expectedResponse = {
        url: 'https://graph.microsoft.com/v1.0/',
        parameters: {
          verb: 'GET',
          values: [],
          links: []
        },
        createdAt: ''
      }
      fetch.mockResponseOnce(JSON.stringify(expectedResponse));

      const store = mockStore({ autocomplete: null });

      // Act
      // @ts-ignore
      store.dispatch(fetchAutoCompleteOptions('https://graph.microsoft.com/v1.0/', 'v1.0'));

      // Assert
      expect(store.getActions()).toEqual([]);
    })
  })


})
