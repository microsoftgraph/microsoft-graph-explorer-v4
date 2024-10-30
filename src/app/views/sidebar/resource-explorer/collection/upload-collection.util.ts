import { ResourcePath } from '../../../../../types/resources';
import { generateResourcePathsFromPostmanCollection } from './postman.util';
import { setQueryResponseStatus } from '../../../../services/slices/query-status.slice';
import { MessageBarType } from '@fluentui/react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { telemetry, eventTypes, componentNames } from '../../../../../telemetry';
import { addResourcePaths } from '../../../../services/slices/collections.slice';
import { translateMessage } from '../../../../utils/translate-messages';

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

export const useFileUpload = () => {
  const dispatch = useAppDispatch();
  const [uploadedCollections, setUploadedCollections] = useState<ResourcePath[]>([]);
  const { collections } = useAppSelector((state) => state);

  const selectFile = () => {
    const fileInput = document.getElementById('file-input');
    fileInput?.click();
  };

  const handleFileSelect = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const fileContent = e!.target!.result!;
        try {
          const jsonData = JSON.parse(fileContent as string);
          const generatedCollection = generateResourcePathsFromPostmanCollection(jsonData);
          if (collections && collections.length > 0 && collections.find(k => k.isDefault)!.paths.length > 0) {
            const currentCollection = collections.find(k => k.isDefault)!.paths;
            if (isGeneratedCollectionInCollection(currentCollection, generatedCollection)) {
              trackUploadAction('Collection exists');
              dispatchCollectionSelectionStatus('Collection items exist', 'Collection items exist');
            }
            else {
              setUploadedCollections(generatedCollection);
              //toggleIsDialogHidden();
            }
          }
          else {
            trackUploadAction('Collection added')
            dispatch(addResourcePaths(generatedCollection));
          }
        }
        catch (error) {
          trackUploadAction('Invalid file format');
          dispatchCollectionSelectionStatus('Invalid file format', 'Invalid file format');
          dispatch(
            setQueryResponseStatus({
              status: translateMessage('Invalid file format'),
              statusText: translateMessage('Invalid file format'),
              ok: false,
              messageType: MessageBarType.error
            })
          )
        }
      };
      reader.readAsText(file);
    }
  };

  const dispatchCollectionSelectionStatus = (status: string, statusMessage: string) => {
    dispatch(
      setQueryResponseStatus({
        status: translateMessage(status),
        statusText: translateMessage(statusMessage),
        ok: false,
        messageType: MessageBarType.error
      })
    )
  }

  return { selectFile, handleFileSelect, uploadedCollections };
};