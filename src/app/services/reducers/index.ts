
import auth from '../slices/auth.slice';
import autoComplete from '../slices/autocomplete.slice';
import collections from '../slices/collections.slice';
import devxApi from '../slices/devxapi.slice';
import dimensions from '../slices/dimensions.slice';
import graphExplorerMode from '../slices/explorer-mode.slice';
import permissionGrants from '../slices/grants.slice';
import graphResponse from '../slices/graph-response.slice';
import history from '../slices/history.slice';
import profile from '../slices/profile.slice';
import proxyUrl from '../slices/proxy.slice';
import resources from '../slices/resources.slice';
import sampleQuery from '../slices/sample-query.slice';
import samplesReducer from '../slices/samples.slice';
import scopes from '../slices/scopes.slice';
import themeChange from '../slices/theme.slice';

import { queryRunnerStatus } from './query-runner-status-reducers';
import { responseAreaExpanded } from './response-expanded-reducer';
import { snippets } from './snippet-reducer';
import { termsOfUse } from './terms-of-use-reducer';
import { sidebarProperties } from './toggle-sidebar-reducer';

const reducers = {
  auth,
  autoComplete,
  collections,
  devxApi,
  dimensions,
  graphExplorerMode,
  graphResponse,
  history,
  permissionGrants,
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

