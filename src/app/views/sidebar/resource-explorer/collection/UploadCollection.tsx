import {
  ActionButton, DefaultButton, Dialog, DialogFooter, DialogType, IIconProps,
  Label, PrimaryButton, getId
} from '@fluentui/react';
import { CSSProperties, useState } from 'react';
import { generateResourcePathsFromPostmanCollection } from './postman.util';

import { useAppDispatch, useAppSelector } from '../../../../../store';
import { ResourcePath } from '../../../../../types/resources';
import { addResourcePaths, removeResourcePaths } from '../../../../services/slices/collections.slice';
import { setQueryResponseStatus } from '../../../../services/slices/query-status.slice';
import { translateMessage } from '../../../../utils/translate-messages';

export const UploadPostmanCollection = () => {
  const dispatch = useAppDispatch();
  const [isDialogHidden, setIsDialogHidden] = useState(true);
  const [uploadedCollections, setUploadedCollections] = useState<ResourcePath[]>([]);
  const { collections } = useAppSelector((state) => state);

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
        try{
          const jsonData = JSON.parse(fileContent as string);
          const generatedCollection = generateResourcePathsFromPostmanCollection(jsonData);
          if(collections && collections.length > 0 && collections.find(k => k.isDefault)!.paths.length > 0){
            setUploadedCollections(generatedCollection);
            toggleIsDialogHidden();
          }
          else{
            dispatch(addResourcePaths(generatedCollection));
          }
        }
        catch(error){
          dispatch(
            setQueryResponseStatus({
              status: translateMessage('Invalid file format'),
              statusText: translateMessage('Invalid file format'),
              ok: true,
              messageBarType: 'error'
            })
          )
        }
      };
      reader.readAsText(file);
    }
  }

  const deleteResourcesDialogProps = {
    type: DialogType.normal,
    title: translateMessage('Upload collection'),
    closeButtonAriaLabel: 'Close',
    subText: translateMessage('Would you like to merge with the current collection?')
  };

  const toggleIsDialogHidden = () => {
    setIsDialogHidden(!isDialogHidden);
  }

  const mergeWithExistingCollection = () => {
    dispatch(addResourcePaths(uploadedCollections));
    setIsDialogHidden(!isDialogHidden);
  }

  const overwriteCollection = () => {
    const resourcePaths = getPathsFromCollection();
    dispatch(removeResourcePaths(resourcePaths));
    setIsDialogHidden(!isDialogHidden);
    dispatch(addResourcePaths(uploadedCollections));
  }

  const getPathsFromCollection = (): ResourcePath[] => {
    let resourcePaths: ResourcePath[] = [];
    if(collections && collections.length > 0){
      const paths = collections.find(k => k.isDefault)!.paths;
      resourcePaths = paths as ResourcePath[];
    }
    return resourcePaths
  }


  return (
    <div style={{position: 'relative', bottom: '4px'}} hidden={true}>
      <input type="file" id="file-input" style={style_} onChange={handleFileSelect}/>
      <ActionButton iconProps={uploadIcon}
        title={translateMessage('Upload collection')}
        ariaLabel={translateMessage('Upload collection')}
        disabled={false}
        onClick={() => selectFile()}
      >
        <Label>
          {translateMessage('Upload collection')}
        </Label>
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
          <PrimaryButton onClick={mergeWithExistingCollection} text={translateMessage('YES')} />
          <DefaultButton onClick={overwriteCollection} text={translateMessage('NO')} />
        </DialogFooter>
      </Dialog>
    </div>
  )
}