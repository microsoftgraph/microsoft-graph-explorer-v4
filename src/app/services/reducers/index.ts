import { combineReducers } from 'redux';
import { authToken } from './auth-reducers';
import { isLoadingData } from './query-loading-reducers';
import { graphResponse } from './query-runner-reducers';

export default combineReducers({
  authToken,
  graphResponse,
  isLoadingData,
});
