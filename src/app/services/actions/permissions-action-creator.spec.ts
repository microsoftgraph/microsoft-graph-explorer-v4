import configureMockStore from 'redux-mock-store';

import { AnyAction } from '@reduxjs/toolkit';
import {
  FETCH_FULL_SCOPES_PENDING,
  FETCH_FULL_SCOPES_SUCCESS,
  GET_CONSENTED_SCOPES_PENDING,
  QUERY_GRAPH_STATUS,
  REVOKE_SCOPES_PENDING
} from '../../../app/services/redux-constants';
import { authenticationWrapper } from '../../../modules/authentication';
import { ApplicationState, store } from '../../../store/index';
import { Mode } from '../../../types/enums';
import { SnippetError } from '../../../types/snippets';
import { getPermissionsScopeType } from '../../utils/getPermissionsScopeType';
import { translateMessage } from '../../utils/translate-messages';
import { ACCOUNT_TYPE } from '../graph-constants';
import { consentToScopes } from '../slices/auth.slice';
import { fetchScopes } from '../slices/scopes.slice';
import { mockThunkMiddleware } from './mockThunkMiddleware';
import { RevokePermissionsUtil } from './permissions-action-creator.util';
import { revokeScopes } from './revoke-scopes.action';

let mockStore = configureMockStore([mockThunkMiddleware]);

beforeEach(() => {
  const mockStore_ = configureMockStore([mockThunkMiddleware]);
  mockStore = mockStore_
})
window.open = jest.fn();

const mockState: ApplicationState = {
  devxApi: {
    baseUrl: 'https://graph.microsoft.com/v1.0/me',
    parameters: '$count=true'
  },
  profile: {
    user: {
      id: '123',
      displayName: 'test',
      emailAddress: 'johndoe@ms.com',
      profileImageUrl: 'https://graph.microsoft.com/v1.0/me/photo/$value',
      ageGroup: 0,
      tenant: 'binaryDomain',
      profileType: ACCOUNT_TYPE.MSA
    },
    status: 'success',
    error: undefined
  },
  sampleQuery: {
    sampleUrl: 'http://localhost:8080/api/v1/samples/1',
    selectedVerb: 'GET',
    selectedVersion: 'v1',
    sampleHeaders: []
  },
  auth: {
    authToken: { token: false, pending: false },
    consentedScopes: ['profile.read User.Read Files.Read']
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
const currentState = store.getState();
store.getState = () => {
  return {
    mockState,
    ...currentState
  }
}

describe('Permissions action creators', () => {

  it('should return a valid scope type when getPermissionsScopeType() is called with a user profile or null', () => {
    // Arrange
    const expectedResult = 'DelegatedWork';

    // Act
    const result = getPermissionsScopeType(null);

    // Assert
    expect(result).toEqual(expectedResult);

  });

  it('should fetch scopes', async () => {
    // Arrange
    const expectedResult = {}
    const expectedAction = [
      {
        type: FETCH_FULL_SCOPES_PENDING,
        payload: undefined
      },
      {
        type: FETCH_FULL_SCOPES_SUCCESS,
        payload: {
          scopes: {
            fullPermissions: {}
          }
        }
      }
    ];

    const store_ = mockStore(store.getState());

    const mockFetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(expectedResult)
      })
    });

    window.fetch = mockFetch;

    // Act
    await store_.dispatch(fetchScopes('full') as unknown as AnyAction);

    // Assert
    expect(store_.getActions().map(action => {
      const { meta, error, ...rest } = action;
      return rest;
    })).toEqual(expectedAction);

  });

  it('should consent to scopes', () => {
    const scopes = ['profile.Read User.Read'];
    // Arrange
    jest.spyOn(authenticationWrapper, 'consentToScopes').mockResolvedValue({
      accessToken: 'jkkkkkkkkkkkkkkkkkkkksdss',
      authority: 'string',
      uniqueId: 'string',
      tenantId: 'string',
      scopes,
      account: {
        homeAccountId: 'string',
        environment: 'string',
        tenantId: 'string',
        username: 'string',
        localAccountId: 'string'
      },
      idToken: 'string',
      idTokenClaims: {},
      fromCache: true,
      expiresOn: new Date(),
      tokenType: 'AAD',
      correlationId: 'string'
    })
    const expectedActions = [
      { type: GET_CONSENTED_SCOPES_PENDING }
    ];

    const store_ = mockStore(mockState);

    // Act and Assert
    store_.dispatch(consentToScopes(scopes) as unknown as AnyAction);


    expect(store_.getActions().map(action => {
      const { meta, ...rest } = action;
      return rest;
    })).toEqual(expectedActions);

  });

  describe('Revoke scopes', () => {
    it('should return Default Scope error when user tries to dissent to default scope', async () => {
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

      const revokePermissionsUtil = await RevokePermissionsUtil.initialize('kkk');

      jest.spyOn(revokePermissionsUtil, 'getUserPermissionChecks').mockResolvedValue({
        userIsTenantAdmin: false,
        permissionBeingRevokedIsAllPrincipal: true,
        grantsPayload: {
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
        }
      })

      const expectedActions = [
        { type: REVOKE_SCOPES_PENDING },
        {
          type: QUERY_GRAPH_STATUS,
          payload: {
            statusText: translateMessage('Revoking'),
            status: translateMessage('Please wait while we revoke this permission'),
            ok: false,
            messageBarType: 'info'
          }
        }
      ]

      // Act
      store_.dispatch(revokeScopes('User.Read') as unknown as AnyAction);

      // Assert
      expect(store_.getActions().map(action => {
        const { meta, ...rest } = action;
        return rest;
      })).toEqual(expectedActions);
    });

    it('should return 401 when user does not have required permissions', async () => {
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
        { type: REVOKE_SCOPES_PENDING },
        {
          type: QUERY_GRAPH_STATUS,
          payload: {
            statusText: translateMessage('Revoking '),
            status: translateMessage('Please wait while we revoke this permission'),
            ok: false,
            messageBarType: 'info'
          }
        }
      ]

      // Act
      store_.dispatch(revokeScopes('Access.Read') as unknown as AnyAction);

      // Assert
      expect(store_.getActions().map(action => {
        const { meta, ...rest } = action;
        return rest;
      })).toEqual(expectedActions);
    });

    it('should raise error when user attempts to dissent to an admin granted permission', async () => {
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
        { type: REVOKE_SCOPES_PENDING, payload: undefined },
        {
          type: QUERY_GRAPH_STATUS,
          payload: {
            statusText: translateMessage('Revoking'),
            status: translateMessage('Please wait while we revoke this permission'),
            ok: false,
            messageBarType: 'info'
          }
        }
      ]
      // Act
      store_.dispatch(revokeScopes('Access.Read') as unknown as AnyAction);

      // Assert
      expect(store_.getActions().map(action => {
        const { meta, ...rest } = action;
        return rest;
      })).toEqual(expectedActions);

    });
  })
})