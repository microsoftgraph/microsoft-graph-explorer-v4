import { AnyAction } from '@reduxjs/toolkit';
import configureMockStore from 'redux-mock-store';
import { getGraphProxyUrl, setGraphProxyUrl } from '../../../app/services/slices/proxy.slice';
import { GRAPH_API_SANDBOX_URL } from '../graph-constants';
import { GET_GRAPH_PROXY_URL_ERROR, GET_GRAPH_PROXY_URL_PENDING, SET_GRAPH_PROXY_URL } from '../redux-constants';
import { mockThunkMiddleware } from './mockThunkMiddleware';

const mockStore = configureMockStore([mockThunkMiddleware]);

describe('Tests Proxy-Action-Creators', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should dispatch SET_GRAPH_PROXY_URL when setGraphProxyUrl is called', () => {
    // Arrange
    const payload: string = 'https://proxy.apisandbox.msdn.microsoft.com/svc';
    const expectedAction = {
      type: SET_GRAPH_PROXY_URL,
      payload
    }

    // Act
    const action = setGraphProxyUrl(payload);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('should dispatch GET_GRAPH_PROXY_URL when getGraphProxyUrl() is called', async () => {
    // Arrange
    fetchMock.mockResponseOnce(GRAPH_API_SANDBOX_URL);
    const store_ = mockStore({});
    await store_.dispatch(getGraphProxyUrl() as unknown as AnyAction);

    const expectedActions = [
      { type: GET_GRAPH_PROXY_URL_PENDING, payload: undefined },
      { type: GET_GRAPH_PROXY_URL_ERROR, payload: GRAPH_API_SANDBOX_URL }
    ];
    expect(store_.getActions().map(action => {
      const { meta, error, ...rest } = action;
      return rest;
    })).toEqual(expectedActions);

  })
})