import {
  DefaultButton, Dialog, DialogFooter, DialogType,
  PrimaryButton, getId} from '@fluentui/react';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../../store';
import { ResourcePath } from '../../../../../types/resources';
import { translateMessage } from '../../../../utils/translate-messages';

import { addResourcePaths, removeResourcePaths } from '../../../../services/slices/collections.slice';
import { trackUploadAction } from './upload-collection.util';

export const UploadPostmanCollection = () => {
  const dispatch = useAppDispatch();
  const [isDialogHidden, setIsDialogHidden] = useState(true);
  const [uploadedCollections] = useState<ResourcePath[]>([]);
  const { collections } = useAppSelector((state) => state);

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