import {
  AUTOCOMPLETE_FETCH_ERROR,
  AUTOCOMPLETE_FETCH_PENDING,
  AUTOCOMPLETE_FETCH_SUCCESS
} from '../../../app/services/redux-constants'
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetch from 'jest-fetch-mock';
import { store } from '../../../../src/store/index';
import { ApplicationState } from '../../../types/root';
import { Mode } from '../../../types/enums';
import {
  fetchAutocompleteSuccess, fetchAutocompleteError,
  fetchAutocompletePending, fetchAutoCompleteOptions
} from '../../../app/services/actions/autocomplete-action-creators';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('../../../../src/store/index');
window.fetch = jest.fn();

const mockState: ApplicationState = {
  devxApi: {
    baseUrl: 'https://graph.microsoft.com/v1.0/me',
    parameters: '$count=true'
  },
  permissionsPanelOpen: true,
  profile: null,
  sampleQuery: {
    sampleUrl: 'http://localhost:8080/api/v1/samples/1',
    selectedVerb: 'GET',
    selectedVersion: 'v1',
    sampleHeaders: []
  },
  authToken: { token: false, pending: false },
  consentedScopes: [],
  isLoadingData: false,
  queryRunnerStatus: null,
  termsOfUse: true,
  theme: 'dark',
  adaptiveCard: {
    pending: false,
    data: {
      template: 'Template'
    }
  },
  graphExplorerMode: Mode.Complete,
  sidebarProperties: {
    showSidebar: true,
    mobileScreen: false
  },
  samples: {
    queries: [],
    pending: false,
    error: null
  },
  scopes: {
    pending: { isSpecificPermissions: false, isFullPermissions: false },
    data: {
      fullPermissions: [],
      specificPermissions: []
    },
    error: null
  },
  history: [],
  graphResponse: {
    body: undefined,
    headers: undefined
  },
  snippets: {
    pending: false,
    data: [],
    error: null
  },
  responseAreaExpanded: false,
  dimensions: {
    request: {
      width: '100px',
      height: '100px'
    },
    response: {
      width: '100px',
      height: '100px'
    },
    sidebar: {
      width: '100px',
      height: '100px'
    },
    content: {
      width: '100px',
      height: '100px'
    }
  },
  autoComplete: {
    data: null,
    error: null,
    pending: false
  },
  resources: {
    pending: false,
    data: {
      segment: '',
      labels: [],
      children: []
    },
    error: null,
    paths: []
  },
  policies: {
    pending: false,
    data: {},
    error: null
  }
}

const currentState = store.getState();
store.getState = () => {
  return {
    mockState,
    ...currentState
  }
}
describe('Autocomplete action creators', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    fetchMock.resetMocks();
  });

  it('should dispatch AUTOCOMPLETE_FETCH_ERROR with error payload when fetchAutocompleteError() is called', () => {
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

  // eslint-disable-next-line max-len
  it('should dispatch AUTOCOMPLETE_FETCH_SUCCESS with autocomplete options when fetchAutocompleteSuccess is called', () => {
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

  it('should dispatch AUTOCOMPLETE_FETCH_PENDING when fetchAutocompletePending() is called', () => {
    // Arrange
    const expectedAction = {
      type: AUTOCOMPLETE_FETCH_PENDING
    }

    // Act
    const action = fetchAutocompletePending();

    // Assert
    expect(action).toEqual(expectedAction);
  })

  jest.mock('../../../../src/modules/suggestions/suggestions.ts', () => {
    return {
      getSuggestions: () => {
        return Promise.resolve({
          url: 'https://graph.microsoft.com/v1.0/',
          parameters: [
            {
              name: 'verb',
              values: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
            }
          ],
          createdAt: '363647474'
        });
      }
    }
  })

  describe('Autocomplete suggestions thunk', () => {
    it('Should begin the api call and pull autocomplete suggestions, but fail and return an empty array ', () => {
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

      const store_ = mockStore({ autocomplete: null });

      // Act
      // @ts-ignore
      store_.dispatch(fetchAutoCompleteOptions('https://graph.microsoft.com/v1.0/', 'v1.0'));

      // Assert
      expect(store_.getActions()).toEqual([]);
    });

    it('should dispatch AUTOCOMPLETE_FETCH_ERROR when fetch does not return autoOptions', () => {
      // Arrange
      const expectedAction = {
        type: AUTOCOMPLETE_FETCH_ERROR,
        response: {}
      };
      const store_ = mockStore({})

      // Act
      // @ts-ignore
      store_.dispatch(fetchAutoCompleteOptions('https://graph.microsoft.com/v1.0/me?', 'v1.0'))
        .then(() => {
          // Assert
          expect(store_.getActions()).toEqual([expectedAction]);
        })

    })
  })
})
