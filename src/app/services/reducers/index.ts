import { combineReducers } from 'redux';
import { queryRunnerReducer } from './query-runner-reducers';

export default combineReducers({
  graphResponse: queryRunnerReducer,
});
