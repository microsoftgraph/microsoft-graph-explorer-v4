
import auth from '../slices/auth.slice';
import autoComplete from '../slices/autocomplete.slice';
import collections from '../slices/collections.slice';
import devxApi from '../slices/devxapi.slice';
import dimensions from '../slices/dimensions.slice';
import graphExplorerMode from '../slices/explorer-mode.slice';
import graphResponse from '../slices/graph-response.slice';
import history from '../slices/history.slice';
import permissionGrants from '../slices/permission-grants.slice';
import profile from '../slices/profile.slice';
import proxyUrl from '../slices/proxy.slice';
import queryRunnerStatus from '../slices/query-status.slice';
import resources from '../slices/resources.slice';
import responseAreaExpanded from '../slices/response-area-expanded.slice';
import sampleQuery from '../slices/sample-query.slice';
import samplesReducer from '../slices/samples.slice';
import scopes from '../slices/scopes.slice';
import snippets from '../slices/snippet.slice';
import themeChange from '../slices/theme.slice';
import termsOfUse from '../slices/terms-of-use.slice';
import sidebarProperties from '../slices/sidebar-properties.slice';

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

