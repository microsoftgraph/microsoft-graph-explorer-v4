import { SET_GRAPH_PROXY_URL } from '../../../app/services/redux-constants';
import { setGraphProxyUrl, getGraphProxyUrl } from '../../../app/services/actions/proxy-action-creator';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppAction } from '../../../types/action';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Tests Proxy-Action-Creators', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  it('should dispatch SET_GRAPH_PROXY_URL when setGraphProxyUrl is called', () => {
    // Arrange
    const response: string = 'https://proxy.apisandbox.msdn.microsoft.com/svc';
    const expectedAction: AppAction = {
      type: SET_GRAPH_PROXY_URL,
      response
    }

    // Act
    const action = setGraphProxyUrl(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('should dispatch SET_GRAPH_PROXY_URL when getGraphProxyUrl() is called', () => {
    // Arrange
    fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    const expectedAction: AppAction = {
      type: SET_GRAPH_PROXY_URL,
      response: {
        ok: false
      }
    }

    const store = mockStore({});

    // Act and Assert
    // @ts-ignore
    store.dispatch(getGraphProxyUrl()).then(() => {
      expect(store.getActions()).toEqual([expectedAction]);
    })
      .catch((e: Error) => { throw e });
  })
})