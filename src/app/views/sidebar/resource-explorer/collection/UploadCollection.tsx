import { CSSProperties } from 'react';
import { generateResourceLinksFromPostmanCollection } from './postman.util';
import { IIconProps, IconButton } from '@fluentui/react';

export const UploadPostmanCollection = () => {

  const uploadIcon: IIconProps = { iconName: 'Upload' };

  const style_: CSSProperties = {
    display: 'none'
  }
  const selectFile = () => {
    const fileInput = document.getElementById('file-input');
    console.log('Found the input component ', fileInput);
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
          // Do something with the parsed JSON data
          console.log('Parsed JSON data:', jsonData);
          const uploadedCollections = generateResourceLinksFromPostmanCollection(jsonData);
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