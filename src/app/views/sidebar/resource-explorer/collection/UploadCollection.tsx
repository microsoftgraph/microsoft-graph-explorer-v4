import { CSSProperties } from 'react';
import { generateResourceLinksFromPostmanCollection } from './postman.util';
import { IIconProps, IconButton } from '@fluentui/react';
import { useAppSelector } from '../../../../../store';
import { useDispatch } from 'react-redux';
import { addResourcePaths, removeResourcePaths } from '../../../../services/actions/collections-action-creators';

export const UploadPostmanCollection = () => {
  const { collections } = useAppSelector(state => state);
  const dispatch = useDispatch();

  const uploadIcon: IIconProps = { iconName: 'Upload' };

  const style_: CSSProperties = {
    display: 'none'
  }
  const selectFile = () => {
    const fileInput = document.getElementById('file-input');
    console.log('Found the input component ', fileInput);
    fileInput?.click();
  }

  const getPaths = () => {
    if(!collections){ return []}
    const paths = collections.find(k => k.isDefault)!.paths;
    return paths;
  }


  const handleFileSelect = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const fileContent = e!.target!.result!;
        try{
          const jsonData = JSON.parse(fileContent as string);
          // Do something with the parsed JSON data
          console.log('Parsed JSON data:', jsonData);
          const uploadedCollections = generateResourceLinksFromPostmanCollection(jsonData);
          dispatch(removeResourcePaths(getPaths()));
          dispatch(addResourcePaths(uploadedCollections));
        }
        catch(error){
          console.log('Error while parsing JSON data:', error);
        }
        // console.log('File content:', fileContent);
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