import { setDevxApiUrl } from '../../../app/services/actions/devxApi-action-creators';
import { SET_DEVX_API_URL_SUCCESS } from '../../../app/services/redux-constants';
import { IDevxAPI } from '../../../types/devx-api';

describe('Devx api url', () => {
  it('should dispatch SET_DEVX_API_URL_SUCCESS when setDevcApiUrl({IDevxAPI object}) is called', () => {

    // Arrange
    const devxApiUrl = new URLSearchParams(location.search).get('devx-api');
    const devxApi: IDevxAPI = {
      baseUrl: devxApiUrl!,
      parameters: ''
    };

    const expectedActions =
    {
      type: SET_DEVX_API_URL_SUCCESS,
      response: devxApi
    };

    // Act
    const action = setDevxApiUrl(devxApi);

    // Assert
    expect(action).toEqual(expectedActions);
  })
});