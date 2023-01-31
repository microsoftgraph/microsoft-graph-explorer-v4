import { resourcesCache } from '../../modules/cache/resources.cache';
import { samplesCache } from '../../modules/cache/samples.cache';
import { saveTheme } from '../../themes/theme-utils';
import { AppAction } from '../../types/action';
import {
  CHANGE_THEME_SUCCESS, FETCH_RESOURCES_SUCCESS, SAMPLES_FETCH_SUCCESS
} from '../services/redux-constants';

const localStorageMiddleware = () => (next: any) => (action: AppAction) => {
  switch (action.type) {
    case CHANGE_THEME_SUCCESS:
      saveTheme(action.response);
      break;

    case SAMPLES_FETCH_SUCCESS:
      samplesCache.saveSamples(action.response);
      break;

    case FETCH_RESOURCES_SUCCESS:
      resourcesCache.saveResources(action.response);
      break;

    default:
      break;
  }
  return next(action);
};

export default localStorageMiddleware;
