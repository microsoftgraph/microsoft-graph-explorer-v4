
import samplesReducer from '../slices/samples.slice';
import themeChange from '../slices/theme.slice';
import sampleQuery from '../slices/sample-query.slice';
import graphExplorerMode from '../slices/explorer-mode.slice';
import authReducer from '../slices/auth.slice';
import autoComplete from '../slices/autocomplete.slice';
import dimensions from '../slices/dimensions.slice';
import devxApi from '../slices/devxapi.slice';

import { collections } from './collections-reducer';
import { scopes } from './permissions-reducer';
import { profile } from './profile-reducer';
import { proxyUrl } from './proxy-url-reducer';
import { isLoadingData } from './query-loading-reducers';
import { graphResponse } from './query-runner-reducers';
import { queryRunnerStatus } from './query-runner-status-reducers';
import { history } from './request-history-reducers';
import { resources } from './resources-reducer';
import { responseAreaExpanded } from './response-expanded-reducer';
import { snippets } from './snippet-reducer';
import { termsOfUse } from './terms-of-use-reducer';
import { sidebarProperties } from './toggle-sidebar-reducer';

const reducers = {
  auth: authReducer,
  autoComplete,
  collections,
  devxApi,
  dimensions,
  graphExplorerMode,
  graphResponse,
  history,
  isLoadingData,
  profile,
  proxyUrl,
  queryRunnerStatus,
  resources,
  responseAreaExpanded,
  sampleQuery,
  samples: samplesReducer,
  scopes,
  sidebarProperties,
  snippets,
  termsOfUse,
  theme: themeChange
};

export {
  reducers
};

