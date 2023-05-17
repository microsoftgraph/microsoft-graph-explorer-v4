import { CSSProperties } from 'react';
import { generateResourcePathsFromPostmanCollection } from './postman.util';
import { IIconProps, IconButton } from '@fluentui/react';
import { useDispatch } from 'react-redux';
import { addResourcePaths } from '../../../../services/actions/collections-action-creators';

export const UploadPostmanCollection = () => {
  const dispatch = useDispatch();

  const uploadIcon: IIconProps = { iconName: 'Upload' };

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
          // dispatch setQuery
          console.log('Error while parsing JSON data:', error);
        }
      };
      reader.readAsText(file);
    }
  }


  return (
    <>
      <input type="file" id="file-input" style={style_} onChange={handleFileSelect}/>
      <IconButton iconProps={uploadIcon} title="Emoji" ariaLabel="Emoji"
        disabled={false} onClick={() => selectFile()} />
    </>
  )
}