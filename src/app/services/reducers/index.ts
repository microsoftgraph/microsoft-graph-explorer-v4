import { combineReducers } from 'redux';

import { authToken } from './auth-reducers';
import { queryRunnerError } from './query-runner-error';
import { graphResponse } from './query-runner-reducers';

export default combineReducers({
  graphResponse,
  authToken,
  queryRunnerError
});
