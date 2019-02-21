import { combineReducers } from 'redux';
import { queryRunner } from './query-runner-reducers';

export default combineReducers({
  graphResponse: queryRunner,
});
