import { SET_GRAPH_PROXY_URL } from '../../../app/services/redux-constants';
import { setGraphProxyUrl } from '../../../app/services/actions/proxy-action-creator';

describe('Tests Proxy-Action-Creators', () => {
  it('Tests that the action creator returns correct action', () => {
    // Arrange
    const response: string = 'https://proxy.apisandbox.msdn.microsoft.com/svc';
    const expectedAction = {
      type: SET_GRAPH_PROXY_URL,
      response
    }

    // Act
    const action = setGraphProxyUrl(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })
})