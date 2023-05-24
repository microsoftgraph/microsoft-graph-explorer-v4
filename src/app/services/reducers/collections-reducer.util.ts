import { AppAction } from '../../../types/action';
import { ResourcePath } from '../../../types/resources';

const getUniquePaths = (paths: ResourcePath[], action: AppAction): ResourcePath[] => {
  return Array.from(
    new Set([...paths, ...action.response])
  );
}

export {
  getUniquePaths
}