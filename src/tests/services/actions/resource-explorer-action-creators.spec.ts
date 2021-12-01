import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
import { addResourcePaths, fetchResourcesSuccess } from '../../../app/services/actions/resource-explorer-action-creators';
import {
  FETCH_RESOURCES_SUCCESS, RESOURCEPATHS_ADD_SUCCESS
} from '../../../app/services/redux-constants';

const paths = [
  {
    key: '5-{serviceHealth-id}-issues',
    url: '/admin/serviceAnnouncement/healthOverviews/{serviceHealth-id}/issues',
    name: 'issues (1)',
    labels: [{ name: 'v1.0', methods: ['Get', 'Post'] }, { name: 'beta', methods: ['Get', 'Post'] }],
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
    labels: [{ name: 'v1.0', methods: ['Get', 'Patch', 'Delete'] }, { name: 'beta', methods: ['Get', 'Patch', 'Delete'] }],
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

    const store = mockStore({
      resources: {
        paths: []
      }
    });

    store.dispatch(addResourcePaths(paths));
    expect(store.getActions()).toEqual(expectedActions);
  });

});
