import { combineReducers } from 'redux';
import { authToken } from './auth-reducers';
import { graphExplorerMode } from './graph-explorer-mode-reducer';
import { isLoadingData } from './query-loading-reducers';
import { queryRunnerError } from './query-runner-error';
import { graphResponse } from './query-runner-reducers';
import { headersAdded } from './request-headers-reducers';

export default combineReducers({
  authToken,
  graphResponse,
  isLoadingData,
  queryRunnerError,
  headersAdded,
  graphExplorerMode
});
