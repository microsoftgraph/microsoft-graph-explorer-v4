import { ResourcePath } from '../../../../../types/resources';
import { telemetry, eventTypes, componentNames } from '../../../../../telemetry';

export const isGeneratedCollectionInCollection = (path1: ResourcePath[], path2: ResourcePath[]): boolean => {
  const smallerPaths = path1.length < path2.length ? path1 : path2;
  const largerPaths = path1.length < path2.length ? path2 : path1;

  const largerPathsCopy = [...largerPaths];
  for(const path of smallerPaths){
    const index = largerPathsCopy.findIndex(smallerPath => compareResourcePaths(smallerPath, path));
    if(index === -1){
      return false;
    }
    largerPathsCopy.splice(index, 1);
  }
  return true;
}

const compareResourcePaths = (path1: ResourcePath, path2: ResourcePath): boolean => {
  // compare mandatory properties
  if(
    path1.name !== path2.name ||
    path1.type !== path2.type ||
    path1.url !== path2.url ||
    !arraysEqual(path1.paths, path2.paths)
  ){
    return false;
  }

  // compare optional propertues
  if(
    (path1.version || '') !== (path2.version || '') ||
        (path1.method || '') !== (path2.method || '') ||
        (path1.key || '') !== (path2.key || '')
  ){
    return false;
  }
  return true;
}

const arraysEqual = (arr1: string[], arr2: string[]) => {
  if(arr1.length !== arr2.length){
    return false;
  }
  const largerPaths = arr1.length < arr2.length ? arr2 : arr1;
  const smallerPaths = arr1.length < arr2.length ? arr1 : arr2;
  for(const item of smallerPaths){
    if(!largerPaths.includes(item)){
      return false;
    }
  }
  return true;
}

export const trackUploadAction = (status: string) => {
  telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
    componentName: componentNames.UPLOAD_COLLECTIONS_BUTTON,
    status
  });
}