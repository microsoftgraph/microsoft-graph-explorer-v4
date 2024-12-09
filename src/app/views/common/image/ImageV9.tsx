import {Image} from '@fluentui/react-components'
import { useEffect, useState } from 'react';
interface ImageProps {
    altText: string;
    body: ReadableStream
}

const ImageV9 = (props: ImageProps)=>{
  const {body, altText} = props;
  const [imageUrl, setImageUrl] = useState<string>('');

  async function getImageUrl() {
    const response = new Response(body);
    response.arrayBuffer().then((buffer: ArrayBuffer) => {
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    });
  }

  useEffect(() => {
    if (body) {
      getImageUrl();
    }
  }, []);

  return (
    <Image src={imageUrl} alt={altText} />
  );
}

export {ImageV9}