import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  fetchResources, fetchResourcesError,
  fetchResourcesPending, fetchResourcesSuccess
} from '../../../app/services/actions/resource-explorer-action-creators';
import {
  FETCH_RESOURCES_ERROR,
  FETCH_RESOURCES_PENDING, FETCH_RESOURCES_SUCCESS
} from '../../../app/services/redux-constants';
import { AppAction } from '../../../types/action';
import { Mode } from '../../../types/enums';
import { ApplicationState } from '../../../types/root';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockState: ApplicationState = {
  devxApi: {
    baseUrl: 'https://graph.microsoft.com/v1.0/me',
    parameters: '$count=true'
  },
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

  it('should dispatch FETCH_RESOURCES_SUCCESS when fetchResourcesSuccess() is called', () => {

    const response = fetchMock.mockResponseOnce(JSON.stringify({ ok: true }));
    const expectedAction: AppAction = {
      type: FETCH_RESOURCES_SUCCESS,
      response
    };

    const action = fetchResourcesSuccess(response);
    expect(action.type).toEqual(expectedAction.type);
  });

  it('should dispatch FETCH_RESOURCES_ERROR when fetchResourcesError() is called', () => {
    // Arrange
    const response = {};
    const expectedAction: AppAction = {
      type: FETCH_RESOURCES_ERROR,
      response
    }

    // Act
    const action = fetchResourcesError(response);

    // Assert
    expect(action.type).toEqual(expectedAction.type);
  })

  it('should dispatch FETCH_RESOURCES_PENDING when fetchResourcesPending() is called', () => {
    // Arrange
    const expectedAction: AppAction = {
      type: FETCH_RESOURCES_PENDING,
      response: null
    }

    // Act
    const action = fetchResourcesPending();

    // Assert
    expect(action.type).toEqual(expectedAction.type);
  });

  it.skip('should dispatch FETCH_RESOURCES_PENDING and FETCH_RESOURCES_SUCCESS when fetchResources() is called', () => {
    // Arrange
    const expectedAction: AppAction[] = [
      { type: FETCH_RESOURCES_PENDING, response: null },
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
  });
});
