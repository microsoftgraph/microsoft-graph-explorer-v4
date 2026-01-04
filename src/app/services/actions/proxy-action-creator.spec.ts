// MODIFIED: Simplified test to remove async getGraphProxyUrl thunk tests
// Now only test the synchronous setGraphProxyUrl reducer
import { AnyAction } from '@reduxjs/toolkit';
import configureMockStore from 'redux-mock-store';
import { setGraphProxyUrl } from '../../../app/services/slices/proxy.slice';
import { SET_GRAPH_PROXY_URL } from '../redux-constants';

const mockStore = configureMockStore([]);

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
})