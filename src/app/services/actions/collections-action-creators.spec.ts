import configureMockStore from 'redux-mock-store';

import {
  RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS
} from '../redux-constants';
import { addResourcePaths, removeResourcePaths } from '../slices/collections.slice';
import { ResourceLinkType, ResourcePath } from '../../../types/resources';

const mockStore = configureMockStore();

const paths: ResourcePath[] = [
  {
    key: '5-{serviceHealth-id}-issues',
    url: '/admin/serviceAnnouncement/healthOverviews/{serviceHealth-id}/issues',
    name: 'issues (1)',
    type: ResourceLinkType.PATH,
    paths: ['/', 'admin', 'serviceAnnouncement', 'healthOverviews', '{serviceHealth-id}']
  }, {
    key: '6-issues-{serviceHealthIssue-id}',
    url: '/admin/serviceAnnouncement/healthOverviews/{serviceHealth-id}/issues/{serviceHealthIssues}',
    name: '{serviceHealthIssue-id} (1)',
    paths: ['/', 'admin', 'serviceAnnouncement', 'healthOverviews', '{serviceHealth-id}', 'issues'],
    type: ResourceLinkType.PATH
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
        payload: paths
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
        payload: paths
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
