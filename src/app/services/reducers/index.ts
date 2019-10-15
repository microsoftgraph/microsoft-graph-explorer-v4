import { combineReducers } from 'redux';
import { adaptiveCard } from './adaptive-cards-reducer';
import { authToken } from './auth-reducers';
import { graphExplorerMode } from './graph-explorer-mode-reducer';
import { sampleQuery } from './query-input-reducers';
import { isLoadingData } from './query-loading-reducers';
import { queryRunnerError } from './query-runner-error';
import { graphResponse } from './query-runner-reducers';
import { headersAdded } from './request-headers-reducers';
import { history } from './request-history-reducers';
import { samples } from './samples-reducers';
import { snippets } from './snippet-reducer';
import { termsOfUse } from './terms-of-use-reducer';
import { theme } from './theme-reducer';
import { sidebarProperties } from './toggle-sidebar-reducer';

export default combineReducers({
  adaptiveCard,
  authToken,
  graphExplorerMode,
  graphResponse,
  headersAdded,
  history,
  isLoadingData,
  queryRunnerError,
  sampleQuery,
  samples,
  sidebarProperties,
  snippets,
  termsOfUse,
  theme,
});
