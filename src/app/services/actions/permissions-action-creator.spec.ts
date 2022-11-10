import {
  FETCH_SCOPES_ERROR,
  FETCH_FULL_SCOPES_SUCCESS,
  FETCH_URL_SCOPES_PENDING,
  QUERY_GRAPH_STATUS
} from '../../../app/services/redux-constants';

import {
  fetchFullScopesSuccess, fetchScopesError, getPermissionsScopeType, fetchScopes,
  consentToScopes,
  fetchUrlScopesPending,
  fetchFullScopesPending,
  revokeScopes
} from './permissions-action-creator';
import { IPermissionsResponse } from '../../../types/permissions';
import { store } from '../../../store/index';
import { ApplicationState } from '../../../types/root';
import { Mode } from '../../../types/enums';
import configureMockStore from 'redux-mock-store';
import { authenticationWrapper } from '../../../modules/authentication';
import thunk from 'redux-thunk';
import { ACCOUNT_TYPE } from '../graph-constants';
import { RevokePermissionsUtil } from './permissions-action-creator.util';
import { cleanup } from '@testing-library/react';
const middleware = [thunk];
let mockStore = configureMockStore(middleware);

afterEach(cleanup);
beforeEach(() => {
  const mockStore_ = configureMockStore(middleware);
  mockStore = mockStore_
})
window.open = jest.fn();

const mockState: ApplicationState = {
  devxApi: {
    baseUrl: 'https://graph.microsoft.com/v1.0/me',
    parameters: '$count=true'
  },
  permissionsPanelOpen: true,
  profile: {
    id: '123',
    displayName: 'test',
    emailAddress: 'johndoe@ms.com',
    profileImageUrl: 'https://graph.microsoft.com/v1.0/me/photo/$value',
    ageGroup: 0,
    tenant: 'binaryDomain',
    profileType: ACCOUNT_TYPE.MSA
  },
  sampleQuery: {
    sampleUrl: 'http://localhost:8080/api/v1/samples/1',
    selectedVerb: 'GET',
    selectedVersion: 'v1',
    sampleHeaders: []
  },
  authToken: { token: false, pending: false },
  consentedScopes: ['profile.read User.Read Files.Read'],
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
      type: 'FETCH_SCOPES_PENDING',
      response: 'full'
    }

    const expectedUrlScopesAction = {
      type: FETCH_URL_SCOPES_PENDING,
      response: 'url'
    }

    // Act
    const fullScopesAction = fetchFullScopesPending();
    const urlScopesAction = fetchUrlScopesPending();

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

  it('should fetch scopes', () => {
    // Arrange
    const expectedResult = {}
    const expectedAction: any = [
      {
        type: 'FETCH_SCOPES_PENDING',
        response: 'full'
      },
      {
        type: 'FULL_SCOPES_FETCH_SUCCESS',
        response: {
          scopes: {
            fullPermissions: {}
          }
        }
      }
    ];

    const store_ = mockStore(mockState);

    const mockFetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(expectedResult)
      })
    });

    window.fetch = mockFetch;

    // Act and Assert
    // @ts-ignore
    return store_.dispatch(fetchScopes())
      // @ts-ignore
      .then(() => {
        expect(store_.getActions()).toEqual(expectedAction);
      });
  });

  it('should consent to scopes', () => {
    // Arrange
    jest.spyOn(authenticationWrapper, 'consentToScopes').mockResolvedValue({
      accessToken: 'jkkkkkkkkkkkkkkkkkkkksdss',
      authority: 'string',
      uniqueId: 'string',
      tenantId: 'string',
      scopes: ['profile.Read User.Read'],
      account: null,
      idToken: 'string',
      idTokenClaims: {},
      fromCache: true,
      expiresOn: new Date(),
      tokenType: 'AAD',
      correlationId: 'string'
    })
    const expectedAction: any = [
      {
        type: 'GET_AUTH_TOKEN_SUCCESS',
        response: true
      },
      {
        type: 'GET_CONSENTED_SCOPES_SUCCESS',
        response: ['profile.Read User.Read']
      },
      {
        type: 'QUERY_GRAPH_STATUS',
        response: {
          statusText: 'Success',
          status: 'Scope consent successful',
          ok: true,
          messageType: 4
        }
      }
    ];

    const store_ = mockStore(mockState);

    // Act and Assert
    // @ts-ignore
    return store_.dispatch(consentToScopes())
      // @ts-ignore
      .then(() => {
        expect(store_.getActions()).toEqual(expectedAction);
      });
  });

  describe('Revoke scopes', () => {
    it('should return Default Scope error when user tries to dissent to default scope', () => {
      // Arrange
      const store_ = mockStore(mockState);
      jest.spyOn(RevokePermissionsUtil, 'getServicePrincipalId').mockResolvedValue('1234');
      jest.spyOn(RevokePermissionsUtil, 'getSignedInPrincipalGrant').mockReturnValue({
        clientId: '1234',
        consentType: 'Principal',
        principalId: '1234',
        resourceId: '1234',
        scope: 'profile.read User.Read',
        id: 'SomeNiceId'
      })
      jest.spyOn(RevokePermissionsUtil, 'getTenantPermissionGrants').mockResolvedValue({
        value: [
          {
            clientId: '1234',
            consentType: 'Principal',
            principalId: '1234',
            resourceId: '1234',
            scope: 'profile.read User.Read',
            id: 'SomeNiceId'
          },
          {
            clientId: '',
            consentType: 'AllPrincipal',
            principalId: null,
            resourceId: '1234',
            scope: 'profile.read User.Read Directory.Read.All'
          }
        ],
        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#permissionGrants'
      })

      const expectedActions = [
        { type: 'REVOKE_SCOPES_PENDING', response: null },
        { type: 'REVOKE_SCOPES_ERROR', response: null },
        {
          type: QUERY_GRAPH_STATUS,
          response: {
            statusText: 'Failed',
            status: 'An error occurred when unconsenting. Please try again',
            ok: false,
            messageType: 1
          }
        }
      ]


      // Act and Assert
      // @ts-ignore
      return store_.dispatch(revokeScopes('User.Read'))
        // @ts-ignore
        .then(() => {
          expect(store_.getActions()).toEqual(expectedActions);
        });
    });

    it('should return 401 when user does not have required permissions', () => {
      // Arrange
      const store_ = mockStore(mockState);
      jest.spyOn(RevokePermissionsUtil, 'getServicePrincipalId').mockResolvedValue('1234');
      jest.spyOn(RevokePermissionsUtil, 'getSignedInPrincipalGrant').mockReturnValue({
        clientId: '1234',
        consentType: 'Principal',
        principalId: '1234',
        resourceId: '1234',
        scope: 'profile.read User.Read Access.Read',
        id: 'SomeNiceId'
      })
      jest.spyOn(RevokePermissionsUtil, 'getTenantPermissionGrants').mockResolvedValue({
        value: [
          {
            clientId: '1234',
            consentType: 'Principal',
            principalId: '1234',
            resourceId: '1234',
            scope: 'profile.read User.Read Access.Read',
            id: 'SomeNiceId'
          },
          {
            clientId: '',
            consentType: 'AllPrincipals',
            principalId: null,
            resourceId: '1234',
            scope: 'profile.read User.Read Directory.Reaqd.All Access.Read'
          }
        ],
        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#permissionGrants'
      });

      const expectedActions = [
        { type: 'REVOKE_SCOPES_PENDING', response: null },
        { type: 'REVOKE_SCOPES_ERROR', response: null },
        {
          type: QUERY_GRAPH_STATUS,
          response: {
            statusText: 'Failed',
            status: 'An error occurred when unconsenting. Please try again',
            ok: false,
            messageType: 1
          }
        }
      ]

      // Act and Assert
      // @ts-ignore
      return store_.dispatch(revokeScopes('Access.Read'))
        // @ts-ignore
        .then(() => {
          expect(store_.getActions()).toEqual(expectedActions);
        });

    });

    //revisit
    it('should raise error when user attempts to dissent to an admin granted permission', () => {
      // Arrange
      const store_ = mockStore(mockState);
      jest.spyOn(RevokePermissionsUtil, 'getServicePrincipalId').mockResolvedValue('1234');
      jest.spyOn(RevokePermissionsUtil, 'getSignedInPrincipalGrant').mockReturnValue({
        clientId: '1234',
        consentType: 'Principal',
        principalId: '1234',
        resourceId: '1234',
        scope: 'profile.read User.Read Access.Read Files.Read',
        id: 'SomeNiceId'
      })
      jest.spyOn(RevokePermissionsUtil, 'getTenantPermissionGrants').mockResolvedValue({
        value: [
          {
            clientId: '1234',
            consentType: 'Principal',
            principalId: '1234',
            resourceId: '1234',
            scope: 'User.Read Access.Read DelegatedPermissionGrant.ReadWrite.All Directory.Read.All Files.Read',
            id: 'SomeNiceId'
          },
          {
            clientId: '',
            consentType: 'AllPrincipals',
            principalId: null,
            resourceId: '1234',
            // eslint-disable-next-line max-len
            scope: 'profile.read User.Read Directory.Reaqd.All Access.Read DelegatedPermissionGrant.ReadWrite.All Directory.Read.All'
          }
        ],
        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#permissionGrants'
      });

      jest.spyOn(RevokePermissionsUtil, 'isSignedInUserTenantAdmin').mockResolvedValue(false);

      const expectedActions = [
        { type: 'REVOKE_SCOPES_PENDING', response: null },
        { type: 'REVOKE_SCOPES_ERROR', response: null },
        {
          type: QUERY_GRAPH_STATUS,
          response: {
            statusText: 'Failed',
            status: 'An error occurred when unconsenting. Please try again',
            ok: false,
            messageType: 1
          }
        }
      ]

      // Act and Assert
      // @ts-ignore
      return store_.dispatch(revokeScopes('Access.Read'))
        // @ts-ignore
        .then(() => {
          expect(store_.getActions()).toEqual(expectedActions);
        });
    });
  })
})