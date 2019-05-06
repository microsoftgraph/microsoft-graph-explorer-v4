import { combineReducers } from 'redux';
import { HelloAuthProvider } from '../graph-client/HelloAuthProvider';

import { authToken } from './auth-reducers';
import { graphResponse } from './query-runner-reducers';

export default combineReducers({
  graphResponse,
  authToken,
});
