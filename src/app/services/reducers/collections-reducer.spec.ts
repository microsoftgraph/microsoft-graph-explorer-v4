import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Collection, IResourceLink, ResourceLinkType } from '../../../types/resources';
import { addResourcePaths, removeResourcePaths } from '../actions/collections-action-creators';
import { RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS } from '../redux-constants';
import { collections } from './collections-reducer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const initialState: Collection[] = [];

const paths = [{
  key: '5-issues',
  url: '/issues',
  name: 'issues (1)',
  labels: [
    {
      name: 'v1.0', methods: [{
        name: 'Get',
        documentationUrl: null
      }, {
        name: 'Post',
        documentationUrl: null
      }]
    },
    {
      name: 'beta', methods: [{
        name: 'Get',
        documentationUrl: null
      }, {
        name: 'Post',
        documentationUrl: null
      }]
    }
  ],
  version: 'v1.0',
  methods: [{
    name: 'Get',
    documentationUrl: null
  }, {
    name: 'Post',
    documentationUrl: null
  }],
  isExpanded: true,
  parent: '/',
  level: 1,
  paths: ['/'],
  type: 'path',
  links: []
}];

const resourceLinks: IResourceLink[] = [
  {
    labels: [
      {
        name: 'v1.0', methods: [{
          name: 'Get',
          documentationUrl: null
        }, {
          name: 'Post',
          documentationUrl: null
        }]
      }
    ],
    key: '5-issues',
    url: '/issues',
    name: 'issues (1)',
    icon: 'LightningBolt',
    isExpanded: true,
    level: 7,
    parent: '/',
    paths: ['/'],
    type: ResourceLinkType.PATH,
    links: []
  }
];

describe('Resources Reducer', () => {
  it('should return initial state', () => {
    const dummyAction = { type: 'Dummy', response: { dummy: 'Dummy' } };
    const newState = collections(initialState, dummyAction);
    expect(newState).toEqual(initialState);
  });

  it('should handle RESOURCEPATHS_ADD_SUCCESS', () => {
    const expectedActions = [{ response: paths, type: RESOURCEPATHS_ADD_SUCCESS }];
    const store = mockStore({ resources: {} });
    store.dispatch(addResourcePaths(paths));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle RESOURCEPATHS_DELETE_SUCCESS', () => {
    const expectedActions = [{ response: paths, type: RESOURCEPATHS_DELETE_SUCCESS }];
    const store = mockStore({
      resources: {
        paths
      }
    });
    store.dispatch(removeResourcePaths(paths));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle RESOURCEPATHS_ADD_SUCCESS and return new state with the paths', () => {
    const newState = { ...initialState };
    newState[0].paths = resourceLinks;
    const action_ = {
      type: RESOURCEPATHS_ADD_SUCCESS,
      response: paths
    }
    const state_ = collections(newState, action_);
    expect(state_[0].paths).toEqual(resourceLinks);
  });

  it('should handle RESOURCEPATHS_DELETE_SUCCESS and return new state with no resource paths', () => {
    const newState = { ...initialState };
    newState[0].paths = resourceLinks;
    const action_ = {
      type: RESOURCEPATHS_DELETE_SUCCESS,
      response: paths
    }
    const state_ = collections(newState, action_);
    expect(state_[0].paths).toEqual([]);
  });

  it('should return unchanged state if no relevant action is passed', () => {
    const newState = { ...initialState };
    const action_ = {
      type: 'Dummy',
      response: { dummy: 'Dummy' }
    }
    const state_ = collections(newState, action_);
    expect(state_).toEqual(newState);
  });

});
