import {
  FETCH_SCOPES_ERROR,
  FETCH_FULL_SCOPES_PENDING,
  FETCH_FULL_SCOPES_SUCCESS,
  FETCH_URL_SCOPES_PENDING
} from '../../../app/services/redux-constants';

import {
  fetchFullScopesSuccess, fetchScopesPending, fetchScopesError, getPermissionsScopeType
} from './permissions-action-creator';
import { IPermissionsResponse } from '../../../types/permissions';
import { store } from '../../../store/index';
import { ApplicationState } from '../../../types/root';
import { Mode } from '../../../types/enums';

window.open = jest.fn();
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
      width: '100',
      height: '100'
    },
    response: {
      width: '100',
      height: '100'
    },
    sidebar: {
      width: '100',
      height: '100'
    },
    content: {
      width: '100',
      height: '100'
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

describe('Permissions action creators', () => {
  it('should dispatch FETCH_SCOPES_SUCCESS when fetchFullScopesSuccess() is called', () => {
    // Arrange
    const response: IPermissionsResponse = {
      scopes: {
        fullPermissions: [],
        specificPermissions: []
      }
    }

    const expectedAction = {
      type: FETCH_FULL_SCOPES_SUCCESS,
      response
    }

    // Act
    const action = fetchFullScopesSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  });

  it('should dispatch FETCH_SCOPES_ERROR when fetchScopesError() is called', () => {
    // Arrange
    const response = {
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
  });

  // eslint-disable-next-line max-len
  it('should dispatch FETCH_FULL_SCOPES_PENDING or FETCH_URL_SCOPES_PENDING depending on type passed to fetchScopesPending', () => {
    // Arrange
    const expectedFullScopesAction = {
      type: FETCH_FULL_SCOPES_PENDING
    }

    const expectedUrlScopesAction = {
      type: FETCH_URL_SCOPES_PENDING
    }

    // Act
    const fullScopesAction = fetchScopesPending(FETCH_FULL_SCOPES_PENDING);
    const urlScopesAction = fetchScopesPending(FETCH_URL_SCOPES_PENDING)

    // Assert
    expect(fullScopesAction).toEqual(expectedFullScopesAction);
    expect(urlScopesAction).toEqual(expectedUrlScopesAction)
  });

  it('should return a valid scope type when getPermissionsScopeType() is called with a user profile or null', () => {
    // Arrange
    const expectedResult = 'DelegatedWork';

    // Act
    const result = getPermissionsScopeType(null);

    // Assert
    expect(result).toEqual(expectedResult);

  });
})