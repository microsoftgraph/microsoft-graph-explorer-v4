import { resources } from '../../../app/services/reducers/resources-reducer';
import {
  FETCH_RESOURCES_ERROR, FETCH_RESOURCES_PENDING,
  FETCH_RESOURCES_SUCCESS
} from '../../../app/services/redux-constants';
import content from '../../../app/utils/resources/resources.json';
import { IResource, IResources } from '../../../types/resources';
const res = JSON.parse(JSON.stringify(content)) as IResource;

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

describe('Resources Reducer', () => {
  it('should return initial state', () => {
    const dummyAction = { type: 'Dummy', response: { dummy: 'Dummy' } };
    const newState = resources(initialState, dummyAction);
    expect(newState).toEqual(initialState);
  });

  it('should handle FETCH_RESOURCES_SUCCESS', () => {
    const newState = { ...initialState };
    newState.data = res;

    const queryAction = { type: FETCH_RESOURCES_SUCCESS, response: res };
    const state = resources(initialState, queryAction);

    expect(state).toEqual(newState);
  });

  it('should handle FETCH_RESOURCES_ERROR', () => {

    const mockResponse = new Error('400');

    const newState = { ...initialState };
    newState.error = mockResponse;
    newState.data = res;

    const queryAction = { type: FETCH_RESOURCES_ERROR, response: mockResponse };
    const state = resources(initialState, queryAction);

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

});
