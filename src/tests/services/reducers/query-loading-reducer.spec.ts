import { isLoadingData } from '../../../app/services/reducers/query-loading-reducers';
import {
  FETCH_SCOPES_ERROR,
  GET_CONSENT_ERROR,
  PROFILE_REQUEST_ERROR,
  PROFILE_REQUEST_SUCCESS,
  QUERY_GRAPH_RUNNING,
  QUERY_GRAPH_STATUS,
  QUERY_GRAPH_SUCCESS
} from '../../../app/services/redux-constants';

describe('Query loading reducer', () => {
  it('should return false in case of get_consent error', () => {
    const initialState = {
      pending: false,
      data: {},
      error: null
    };
    const dummyAction = {
      type: GET_CONSENT_ERROR,
      response: null
    };

    const newState = isLoadingData(initialState, dummyAction);
    expect(newState).toEqual(false);
  });

  it('should return false in case of QUERY_GRAPH_SUCCESS', () => {
    const initialState = {};
    const dummyAction = {
      type: QUERY_GRAPH_SUCCESS,
      response: null
    };

    const newState = isLoadingData(initialState, dummyAction);
    expect(newState).toEqual(false);
  });

  it('should return false in case of FETCH_SCOPES_ERROR', () => {
    const initialState = {};
    const dummyAction = {
      type: FETCH_SCOPES_ERROR,
      response: null
    }

    const newState = isLoadingData(initialState, dummyAction);
    expect(newState).toEqual(false);
  });

  it('should retur false in case of PROFILE_REQUEST_SUCCESS', () => {
    const initialState = {};
    const dummyAction = {
      type: PROFILE_REQUEST_SUCCESS,
      response: null
    }

    const newState = isLoadingData(initialState, dummyAction);
    expect(newState).toEqual(false);
  });

  it('should return false in case of PROFILE_REQUEST_SUCCESS', () => {
    const initialState = {};
    const dummyAction = {
      type: PROFILE_REQUEST_SUCCESS,
      response: null
    }

    const newState = isLoadingData(initialState, dummyAction);
    expect(newState).toEqual(false);
  });

  it('should return unaltered state by default', () => {
    const initialState = {
      pending: false,
      data: {},
      error: null
    };
    const dummyAction = {
      type: '',
      response: null
    }

    const newState = isLoadingData(initialState, dummyAction);
    expect(newState).toEqual(initialState);
  });

  it('should return a response in case of QUERY_GRAPH_RUNNING', () => {
    const initialState = {
      pending: false,
      data: {},
      error: null
    };
    const dummyAction = {
      type: QUERY_GRAPH_RUNNING,
      response: {
        pending: true,
        data: {},
        error: null
      }
    }

    const newState = isLoadingData(initialState, dummyAction);
    expect(newState).toEqual(dummyAction.response);
  });
})