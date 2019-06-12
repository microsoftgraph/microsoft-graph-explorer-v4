import { combineReducers } from 'redux';
import { authToken } from './auth-reducers';
import { sampleQuery } from './query-input-reducers';
import { isLoadingData } from './query-loading-reducers';
import { queryRunnerError } from './query-runner-error';
import { graphResponse } from './query-runner-reducers';
import { headersAdded } from './request-headers-reducers';

export default combineReducers({
  authToken,
  headersAdded,
  graphResponse,
  isLoadingData,
  queryRunnerError,
  sampleQuery,
});
