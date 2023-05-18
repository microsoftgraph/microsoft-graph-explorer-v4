import { CSSProperties } from 'react';
import { generateResourcePathsFromPostmanCollection } from './postman.util';
import { ActionButton, IIconProps, Label } from '@fluentui/react';
import { useDispatch } from 'react-redux';
import { addResourcePaths } from '../../../../services/actions/collections-action-creators';
import { translateMessage } from '../../../../utils/translate-messages';
import { setQueryResponseStatus } from '../../../../services/actions/query-status-action-creator';

export const UploadPostmanCollection = () => {
  const dispatch = useDispatch();

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
          const uploadedCollections = generateResourcePathsFromPostmanCollection(jsonData);
          dispatch(addResourcePaths(uploadedCollections));
        }
        catch(error){
          dispatch(
            setQueryResponseStatus({
              status: 'error',
              statusMessage: translateMessage('Invalid file format')
            })
          )
        }
      };
      reader.readAsText(file);
    }
  }


  return (
    <div style={{position: 'relative', bottom: '4px'}}>
      <input type="file" id="file-input" style={style_} onChange={handleFileSelect}/>
      <ActionButton iconProps={uploadIcon}
        title={translateMessage('Upload collection')}
        ariaLabel={translateMessage('Upload collection')}
        disabled={false}
        onClick={() => selectFile()}
      >
        <Label>
          {translateMessage('Upload')}
        </Label>
      </ActionButton>
    </div>
  )
}