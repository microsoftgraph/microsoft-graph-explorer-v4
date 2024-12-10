
import { AnyAction } from '@reduxjs/toolkit';
import configureMockStore from 'redux-mock-store';

import { ApplicationState, store } from '../../../../src/store/index';
import { fetchAutoCompleteOptions } from '../../../app/services/slices/autocomplete.slice';
import { suggestions } from '../../../modules/suggestions/suggestions';
import { Mode } from '../../../types/enums';
import { SnippetError } from '../../../types/snippets';
import { AUTOCOMPLETE_FETCH_ERROR, AUTOCOMPLETE_FETCH_PENDING, AUTOCOMPLETE_FETCH_SUCCESS } from '../redux-constants';
import { mockThunkMiddleware } from './mockThunkMiddleware';


const mockStore = configureMockStore([mockThunkMiddleware]);

jest.mock('../../../../src/store/index');
window.fetch = jest.fn();

const mockState: ApplicationState = {
  devxApi: {
    baseUrl: 'https://graph.microsoft.com/v1.0/me',
    parameters: '$count=true'
  },
  profile: {
    user: undefined,
    error: undefined,
    status: 'unset'
  },
  sampleQuery: {
    sampleUrl: 'http://localhost:8080/api/v1/samples/1',
    selectedVerb: 'GET',
    selectedVersion: 'v1',
    sampleHeaders: []
  },
  auth: {
    authToken: { token: false, pending: false },
    consentedScopes: []
  },
  queryRunnerStatus: null,
  termsOfUse: true,
  theme: 'dark',
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
    isLoadingData: false,
    response: {
      body: undefined,
      headers: {}
    }
  },
  snippets: {
    pending: false,
    data: {},
    error: {} as SnippetError
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
    data: {},
    error: null
  },
  permissionGrants: {
    pending: false,
    permissions: [],
    error: null
  },
  collections: {
    collections: [],
    saved: false
  },
  proxyUrl: ''
}

store.getState = () => ({
  ...mockState,
  proxyUrl: '',
  collections: {
    collections: [],
    saved: false
  },
  graphExplorerMode: Mode.Complete,
  queryRunnerStatus: null,
  samples: {
    queries: [],
    pending: false,
    error: null
  }
})

describe('fetchAutoCompleteOptions', () => {
  it('dispatches fetchAutocompleteSuccess when suggestions are retrieved successfully', async () => {
    const url = '/some/url';
    const version = '1.0';

    // Replace this with a sample response object you expect from suggestions.getSuggestions
    const sampleSuggestions = ['option1', 'option2', 'option3'];
    suggestions.getSuggestions = jest.fn().mockResolvedValue(sampleSuggestions);

    // Create a mock store
    const store_ = mockStore(store.getState());

    // Call the function by dispatching the returned async function
    await store_.dispatch(fetchAutoCompleteOptions({ url, version }) as unknown as AnyAction);

    // Assertions
    const expectedActions = [
      { type: AUTOCOMPLETE_FETCH_PENDING, payload: undefined },
      {
        type: AUTOCOMPLETE_FETCH_SUCCESS,
        payload: ['option1', 'option2', 'option3']
      }
    ];
    expect(store_.getActions().map(action => {
      const { meta, ...rest } = action;
      return rest;
    })).toEqual(expectedActions);
  });

  it('dispatches fetchAutocompleteError when suggestions retrieval fails', async () => {
    const url = '/some/url';
    const version = '1.0';

    // Mock a response with an error
    suggestions.getSuggestions = jest.fn().mockRejectedValue(new Error());

    // Create a mock store
    const store_ = mockStore(store.getState());

    // Call the function by dispatching the returned async function
    await store_.dispatch(fetchAutoCompleteOptions({ url, version }) as unknown as AnyAction);

    // Assertions
    const expectedActions = [
      { type: AUTOCOMPLETE_FETCH_PENDING, payload: undefined },
      { type: AUTOCOMPLETE_FETCH_ERROR, payload: new Error() }
    ];
    expect(store_.getActions().map(action => {
      const { meta, error, ...rest } = action;
      return rest;
    })).toEqual(expectedActions);
  });
});
