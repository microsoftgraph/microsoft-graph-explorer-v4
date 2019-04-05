import { combineReducers } from 'redux';

import { authResponse } from './auth-reducers';
import { graphResponse } from './query-runner-reducers';

export default combineReducers({
  graphResponse,
  authResponse,
});
