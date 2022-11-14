import React, { useEffect, useState } from 'react';
import { IImageComponentProps } from '../../../../types/image';

export const Image = ({ styles, alt, body }: IImageComponentProps): JSX.Element => {
  const [imageUrl, setImageUrl] = useState<string>('');

  async function getImageUrl() {
    body.clone().arrayBuffer().then((buffer: any) => {
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
    <img style={styles} src={imageUrl} alt={alt} />
  );
}
