import {
  ActionButton, DefaultButton, Dialog, DialogFooter, DialogType, IIconProps,
  MessageBarType, PrimaryButton, getId,
  getTheme
} from '@fluentui/react';
import { CSSProperties, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { ResourcePath } from '../../../../../types/resources';
import { translateMessage } from '../../../../utils/translate-messages';
import { collectionStyles } from './Collection.styles';
import { generateResourcePathsFromPostmanCollection } from './postman.util';

import { addResourcePaths, removeResourcePaths } from '../../../../services/slices/collections.slice';
import { setQueryResponseStatus } from '../../../../services/slices/query-status.slice';
import { isGeneratedCollectionInCollection } from './upload-collection.util';

export const UploadPostmanCollection = () => {
  const dispatch = useAppDispatch();
  const [isDialogHidden, setIsDialogHidden] = useState(true);
  const [uploadedCollections, setUploadedCollections] = useState<ResourcePath[]>([]);
  const { collections } = useAppSelector((state) => state);
  const theme = getTheme();
  const { uploadButtonStyles } = collectionStyles(theme);

  const uploadIcon: IIconProps = {
    iconName: 'Upload'
  };

  const style_: CSSProperties = {
    display: 'none'
  }

  const selectFile = () => {
    const fileInput = document.getElementById('file-input');
    fileInput?.click();
  }

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
              toggleIsDialogHidden();
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
  }

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

  const trackUploadAction = (status: string) => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      componentName: componentNames.UPLOAD_COLLECTIONS_BUTTON,
      status
    });
  }

  const deleteResourcesDialogProps = {
    type: DialogType.normal,
    title: translateMessage('Upload collection'),
    closeButtonAriaLabel: 'Close',
    subText: translateMessage('You have an existing')
  };

  const toggleIsDialogHidden = () => {
    setIsDialogHidden(!isDialogHidden);
  }

  const mergeWithExistingCollection = () => {
    trackUploadAction('Collection merged');
    dispatch(addResourcePaths(uploadedCollections));
    setIsDialogHidden(!isDialogHidden);
  }

  const overwriteCollection = () => {
    trackUploadAction('Collection replaced');
    const resourcePaths = getPathsFromCollection();
    dispatch(removeResourcePaths(resourcePaths));
    setIsDialogHidden(!isDialogHidden);
    dispatch(addResourcePaths(uploadedCollections));
  }

  const getPathsFromCollection = (): ResourcePath[] => {
    let resourcePaths: ResourcePath[] = [];
    if (collections && collections.length > 0) {
      const paths = collections.find(k => k.isDefault)!.paths;
      resourcePaths = paths as ResourcePath[];
    }
    return resourcePaths
  }

  return (
    <div style={{ position: 'relative', bottom: '4px' }} >
      <ActionButton iconProps={uploadIcon}
        title={translateMessage('Upload collection')}
        ariaLabel={translateMessage('Upload collection')}
        disabled={false}
        onClick={() => selectFile()}
        styles={uploadButtonStyles}
      >
        <input type="file" id="file-input" style={style_} onInput={handleFileSelect} value={''} />
      </ActionButton>
      <Dialog
        hidden={isDialogHidden}
        onDismiss={toggleIsDialogHidden}
        dialogContentProps={deleteResourcesDialogProps}
        modalProps={{
          titleAriaId: getId('dialogLabel'),
          subtitleAriaId: getId('subTextLabel'),
          isBlocking: true
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={mergeWithExistingCollection} text={translateMessage('Merge with existing')} />
          <DefaultButton onClick={overwriteCollection} text={translateMessage('Replace existing')} />
        </DialogFooter>
      </Dialog>
    </div>
  )
}