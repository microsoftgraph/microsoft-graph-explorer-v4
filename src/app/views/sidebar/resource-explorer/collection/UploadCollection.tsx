import { CSSProperties, useState } from 'react';
import { generateResourcePathsFromPostmanCollection } from './postman.util';
import { ActionButton, DefaultButton, Dialog, DialogFooter, DialogType, IIconProps,
  Label, MessageBarType, PrimaryButton, getId, getTheme } from '@fluentui/react';
import { useDispatch } from 'react-redux';
import { addResourcePaths, removeResourcePaths } from '../../../../services/actions/collections-action-creators';
import { translateMessage } from '../../../../utils/translate-messages';
import { setQueryResponseStatus } from '../../../../services/actions/query-status-action-creator';
import { ResourcePath } from '../../../../../types/resources';
import { useAppSelector } from '../../../../../store';
import { collectionStyles } from './Collection.styles';
import { isGeneratedCollectionInCollection } from './upload-collection.util';

export const UploadPostmanCollection = () => {
  const dispatch = useDispatch();
  const [isDialogHidden, setIsDialogHidden] = useState(true);
  const [uploadedCollections, setUploadedCollections] = useState<ResourcePath[]>([]);
  const { collections } = useAppSelector((state) => state);
  const theme = getTheme();
  const { uploadButtonStyles, uploadLabelStyles } = collectionStyles(theme);

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
            const currentCollection = collections.find(k => k.isDefault)!.paths;
            if(isGeneratedCollectionInCollection(currentCollection, generatedCollection)){
              dispatchCollectionSelectionStatus('Collection items exist', 'Collection items exist');
            }
            else{
              setUploadedCollections(generatedCollection);
              toggleIsDialogHidden();
            }
          }
          else{
            dispatch(addResourcePaths(generatedCollection));
          }
        }
        catch(error){
          dispatchCollectionSelectionStatus('Invalid file format', 'Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  }

  const dispatchCollectionSelectionStatus = (status: string, statusMessage: string) => {
    dispatch(
      setQueryResponseStatus({
        status: translateMessage(status),
        statusMessage: translateMessage(statusMessage),
        ok: false,
        messageType: MessageBarType.error
      })
    )
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
    <div style={{position: 'relative', bottom: '4px'}} >
      <ActionButton iconProps={uploadIcon}
        title={translateMessage('Upload collection')}
        ariaLabel={translateMessage('Upload collection')}
        disabled={false}
        onClick={() => selectFile()}
        styles={uploadButtonStyles}
      >
        <input type="file" id="file-input" style={style_} onInput={handleFileSelect} value={''}/>
        <Label styles = {uploadLabelStyles}>
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
          <PrimaryButton onClick={mergeWithExistingCollection} text={translateMessage('Merge with existing')} />
          <DefaultButton onClick={overwriteCollection} text={translateMessage('Replace existing')} />
        </DialogFooter>
      </Dialog>
    </div>
  )
}