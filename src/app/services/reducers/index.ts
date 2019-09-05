import { combineReducers } from 'redux';
import { authToken } from './auth-reducers';
import { graphExplorerMode } from './graph-explorer-mode-reducer';
import { sampleQuery } from './query-input-reducers';
import { isLoadingData } from './query-loading-reducers';
import { queryRunnerError } from './query-runner-error';
import { graphResponse } from './query-runner-reducers';
import { headersAdded } from './request-headers-reducers';
import { history } from './request-history-reducers';
import { samples } from './samples-reducers';
import { theme } from './theme-reducer';

export default combineReducers({
  authToken,
  graphExplorerMode,
  graphResponse,
  headersAdded,
  history,
  isLoadingData,
  queryRunnerError,
  sampleQuery,
  samples,
  theme
});
