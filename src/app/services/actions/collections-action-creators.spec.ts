import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS
} from '../redux-constants';
import { addResourcePaths, removeResourcePaths } from './collections-action-creators';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

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

describe('Collections actions', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should dispatch RESOURCEPATHS_ADD_SUCCESS when addResourcePaths() is called with valid paths', () => {

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

  it('should dispatch RESOURCEPATHS_DELETE_SUCCESS when removeResourcePaths() is dispatched', () => {

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

});
