import configureMockStore from 'redux-mock-store';

import { AnyAction } from '@reduxjs/toolkit';
import {
  FETCH_RESOURCES_PENDING, FETCH_RESOURCES_SUCCESS
} from '../../../app/services/redux-constants';
import { ApplicationState } from '../../../store';
import { Mode } from '../../../types/enums';
import { SnippetError } from '../../../types/snippets';
import { fetchResources } from '../slices/resources.slice';
import { mockThunkMiddleware } from './mockThunkMiddleware';

const mockStore = configureMockStore([mockThunkMiddleware]);

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
    error: null,
    hasAutoSelectedDefault: false
  },
  permissionGrants: {
    permissions: [],
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
  collections: {
    collections: [],
    saved: false
  },
  proxyUrl: ''
}

const paths = [
  {
    key: '5-{serviceHealth-id}-issues',
    url: '/admin/serviceAnnouncement/healthOverviews/{serviceHealth-id}/issues',
    name: 'issues (1)',
    labels: [
      { name: 'v1.0', methods: ['GET', 'POST'] },
      { name: 'beta', methods: ['GET', 'POST'] }
    ],
    isExpanded: true,
    parent: '{serviceHealth-id}',
    level: 5,
    paths: ['/', 'admin', 'serviceAnnouncement', 'healthOverviews', '{serviceHealth-id}'],
    type: 'path',
    links: []
  }, {
    key: '6-issues-{serviceHealthIssue-id}',
    url: '/admin/serviceAnnouncement/healthOverviews/{serviceHealth-id}/issues/{serviceHealthIssue-id}',
    name: '{serviceHealthIssue-id} (1)',
    labels: [
      { name: 'v1.0', methods: ['GET', 'PATCH', 'DELETE'] },
      { name: 'beta', methods: ['GET', 'PATCH', 'DELETE'] }
    ],
    isExpanded: true,
    parent: 'issues',
    level: 6,
    paths: ['/', 'admin', 'serviceAnnouncement', 'healthOverviews', '{serviceHealth-id}', 'issues'],
    type: 'path',
    links: []
  }
];

describe('Resource Explorer actions', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should dispatch FETCH_RESOURCES_PENDING and FETCH_RESOURCES_SUCCESS when fetchResources() is called',
    async () => {
      const expectedResults = paths;
      const expectedActions = [
        { type: FETCH_RESOURCES_PENDING, payload: undefined },
        {
          type: FETCH_RESOURCES_SUCCESS,
          payload: { 'v1.0': paths, 'beta': paths }
        }
      ]

      const store_ = mockStore(mockState);
      const mockFetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(expectedResults)
        })
      });

      window.fetch = mockFetch;

      await store_.dispatch(fetchResources() as unknown as AnyAction);

      expect(store_.getActions().map(action => {
        const { meta, ...rest } = action;
        return rest;
      })).toEqual(expectedActions);
    });
});
