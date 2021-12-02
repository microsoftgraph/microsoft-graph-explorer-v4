import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { addResourcePaths, removeResourcePaths } from '../../../app/services/actions/resource-explorer-action-creators';
import { resources } from '../../../app/services/reducers/resources-reducer';
import {
  FETCH_RESOURCES_ERROR, FETCH_RESOURCES_PENDING,
  FETCH_RESOURCES_SUCCESS,
  RESOURCEPATHS_ADD_SUCCESS,
  RESOURCEPATHS_DELETE_SUCCESS
} from '../../../app/services/redux-constants';
import content from '../../../app/utils/resources/resources.json';
import { IResource, IResources } from '../../../types/resources';

const res = JSON.parse(JSON.stringify(content)) as IResource;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const initialState: IResources = {
  pending: false,
  data: {
    children: [],
    labels: [],
    segment: ''
  },
  error: null,
  paths: []
};

const paths = [{
  key: '5-issues',
  url: '/issues',
  name: 'issues (1)',
  labels: [
    { name: 'v1.0', methods: ['Get', 'Post'] },
    { name: 'beta', methods: ['Get', 'Post'] }
  ],
  version: 'v1.0',
  methods: ['Get', 'Post'],
  isExpanded: true,
  parent: '/',
  level: 1,
  paths: ['/'],
  type: 'path',
  links: []
}];

describe('Resources Reducer', () => {
  it('should return initial state', () => {
    const dummyAction = { type: 'Dummy', response: { dummy: 'Dummy' } };
    const newState = resources(initialState, dummyAction);
    expect(newState).toEqual(initialState);
  });

  it('should handle FETCH_RESOURCES_SUCCESS', () => {
    const newState = { ...initialState };
    newState.data = res;

    const resourceAction = { type: FETCH_RESOURCES_SUCCESS, response: res };
    const state = resources(initialState, resourceAction);

    expect(state).toEqual(newState);
  });

  it('should handle FETCH_RESOURCES_ERROR', () => {

    const mockResponse = new Error('400');

    const newState = { ...initialState };
    newState.error = mockResponse;
    newState.data = res;

    const resourceAction = { type: FETCH_RESOURCES_ERROR, response: mockResponse };
    const state = resources(initialState, resourceAction);

    expect(state).toEqual(newState);
  });

  it('should handle FETCH_RESOURCES_PENDING', () => {
    const isRunning = true;
    const newState = { ...initialState };
    newState.pending = isRunning;
    const queryAction: any = { type: FETCH_RESOURCES_PENDING };
    const state = resources(initialState, queryAction);
    expect(state).toEqual(newState);
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

});
