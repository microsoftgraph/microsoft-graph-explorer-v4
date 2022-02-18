import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
import {
  addResourcePaths, fetchResourcesSuccess, fetchResourcesError,
  fetchResourcesPending, removeResourcePaths, fetchResources
} from '../../../app/services/actions/resource-explorer-action-creators';
import {
  FETCH_RESOURCES_SUCCESS, RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS, FETCH_RESOURCES_ERROR,
  FETCH_RESOURCES_PENDING
} from '../../../app/services/redux-constants';
import { Mode } from '../../../types/enums';
import { IRootState } from '../../../types/root';

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

const paths = [
  {
    key: '5-{serviceHealth-id}-issues',
    url: '/admin/serviceAnnouncement/healthOverviews/{serviceHealth-id}/issues',
    name: 'issues (1)',
    labels: [
      { name: 'v1.0', methods: ['Get', 'Post'] },
      { name: 'beta', methods: ['Get', 'Post'] }
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
      { name: 'v1.0', methods: ['Get', 'Patch', 'Delete'] },
      { name: 'beta', methods: ['Get', 'Patch', 'Delete'] }
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

  it('creates FETCH_RESOURCES_SUCCESS when fetchResourcesSuccess is called', () => {

    const response = fetchMock.mockResponseOnce(JSON.stringify({ ok: true }));
    const expectedAction = {
      type: FETCH_RESOURCES_SUCCESS,
      response
    };

    const action = fetchResourcesSuccess(response);
    expect(action).toEqual(expectedAction);
  });

  it('Adds resource paths to state', () => {

    const expectedActions = [
      {
        type: RESOURCEPATHS_ADD_SUCCESS,
        response: paths
      }
    ];

    const store_ = mockStore({
      resources: {
        paths: []
      }
    });

    store_.dispatch(addResourcePaths(paths));
    expect(store_.getActions()).toEqual(expectedActions);
  });

  it('dispatches RESOURCEPATHS_DELETE_SUCCESS when removeResourcePaths is dispatched', () => {

    const expectedActions = [
      {
        type: RESOURCEPATHS_DELETE_SUCCESS,
        response: paths
      }
    ];

    const store_ = mockStore({
      resources: {
        paths
      }
    });

    store_.dispatch(removeResourcePaths(paths));
    expect(store_.getActions()).toEqual(expectedActions);
  })

  it('creates FETCH_RESOURCES_ERROR when fetchResourcesError is called', () => {
    // Arrange
    const response = {};
    const expectedAction = {
      type: FETCH_RESOURCES_ERROR,
      response
    }

    // Act
    const action = fetchResourcesError(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('crates FETCH_RESOURCES_PENDING when resources are being fetched', () => {
    // Arrange
    const expectedAction = {
      type: FETCH_RESOURCES_PENDING
    }

    // Act
    const action = fetchResourcesPending();

    // Assert
    expect(action).toEqual(expectedAction);
  });

  it('fetches resource paths and dispatches FETCH_RESOURCES_SUCCESS', () => {
    // Arrange
    const expectedAction = [
      { type: FETCH_RESOURCES_PENDING },
      {
        type: FETCH_RESOURCES_SUCCESS,
        response: { paths, ok: true }
      }
    ]

    const store = mockStore(mockState);
    fetchMock.mockResponseOnce(JSON.stringify({ paths, ok: true }));

    // Act and Assert
    // @ts-ignore
    store.dispatch(fetchResources())
      .then(() => {
        expect(store.getActions()).toEqual(expectedAction);
      })
      .catch((e: Error) => { throw e })
  })

});
