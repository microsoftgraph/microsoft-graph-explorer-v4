import {
  FETCH_SCOPES_ERROR,
  FETCH_SCOPES_PENDING,
  FETCH_SCOPES_SUCCESS,
  QUERY_GRAPH_STATUS
} from '../../../app/services/redux-constants';

import {
  fetchScopesSuccess, fetchScopesPending, fetchScopesError, getPermissionsScopeType, fetchScopes,
  consentToScopes
} from
  '../../../app/services/actions/permissions-action-creator';
import { IPermissionsResponse } from '../../../types/permissions';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetch from 'jest-fetch-mock';
import { store } from '../../../../src/store/index';
import { IRootState } from '../../../types/root';
import { Mode } from '../../../types/enums';
const middleware = [thunk];
const mockStore = configureMockStore(middleware);

window.open = jest.fn();

const mockState: IRootState = {
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
    pending: false,
    data: [],
    hasUrl: false,
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

jest.mock('../../../app/services/actions/autocomplete-action-creators.ts', () => {
  const autocomplete_ = jest.requireActual('../../../app/services/actions/autocomplete-action-creators.ts');
  return {
    ...autocomplete_,
    getPermissionsScopeType: jest.fn(() => 'DelegatedWork')
  }
})

describe('tests permissions action creators', () => {
  it('Tests if FETCH_SCOPES_SUCCESS is dispatched when fetchScopesSuccess is called', () => {
    // Arrange
    const response: IPermissionsResponse = {
      hasUrl: true,
      scopes: [
        {
          value: '',
          consentDescription: '',
          isAdmin: false,
          consented: true
        }
      ]
    }

    const expectedAction = {
      type: FETCH_SCOPES_SUCCESS,
      response
    }

    // Act
    const action = fetchScopesSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('Tests if FETCH_SCOPES_ERROR is dispatched when fetchScopesError is called', () => {
    // Arrange
    const response = {
      hasUrl: true,
      error: {}
    }

    const expectedAction = {
      type: FETCH_SCOPES_ERROR,
      response
    }

    // Act
    const action = fetchScopesError(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('Tests if FETCH_SCOPES_PENDING is dispatched when fetchScopes pending is called', () => {
    // Arrange
    const expectedAction = {
      type: FETCH_SCOPES_PENDING
    }

    // Act
    const action = fetchScopesPending();

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('returns valid scope type given a user profile or with null', () => {
    // Arrange
    const expectedResult = 'DelegatedWork';

    // Act
    const result = getPermissionsScopeType(null);

    // Assert
    expect(result).toEqual(expectedResult);

  });

  it('Tests the fetchScopes function', () => {
    // Arrange
    const api_response = {
      scopes: [],
      ok: true
    }
    fetch.mockResponseOnce(JSON.stringify(api_response));

    try {
      // Act
      // @ts-ignore
      store.dispatch(fetchScopes())
        .then((response_: any) => {
          expect(response_.scopes).toBe(undefined);
        })
        .catch((e: any) => { throw e })
    }
    catch (e) {
      //
    }
  })

  // Revisit this test
  it('Tests consenting to scopes function', () => {
    // Arrange
    const store_ = mockStore({});
    fetch.mockResponseOnce(JSON.stringify({}));

    // Act and Assert
    // @ts-ignore
    store_.dispatch(consentToScopes([]))
      .then(() => {
        expect(store_.getActions()[0].type).toEqual(QUERY_GRAPH_STATUS);
      })
      .catch((e: any) => { throw e })
  })
})