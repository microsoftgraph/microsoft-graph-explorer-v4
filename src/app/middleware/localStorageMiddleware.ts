import { samplesCache } from '../../modules/cache/samples.cache';
import { saveTheme } from '../../themes/theme-utils';
import { AppAction } from '../../types/action';
import {
  CHANGE_THEME_SUCCESS, SAMPLES_FETCH_SUCCESS
} from '../services/redux-constants';

const localStorageMiddleware = () => (next: any) => (action: AppAction) => {
  switch (action.type) {
    case CHANGE_THEME_SUCCESS:
      saveTheme(action.response);
      break;

    case SAMPLES_FETCH_SUCCESS:
      samplesCache.saveSamples(action.response);
      break;

    default:
      break;
  }
  return next(action);
};

export default localStorageMiddleware;
