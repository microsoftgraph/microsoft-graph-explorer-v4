import { MessageBar } from '@fluentui/react';
import { useState } from 'react';

import { BANNERMESSAGE } from '../../services/variant-constants';
import variantService from '../../services/variant-service';

const BannerNotification = () => {
  const [bannerMessage, setBannerMessage] = useState('');

  setTimeout(() => {
    variantService.getFeatureVariables('default', BANNERMESSAGE).then((value) => {
      if (value && value !== ' ') {
        setBannerMessage(value as string);
      }
    });
  }, 1000);

  if (!!!bannerMessage) {
    return null;
  }

  return (
    <MessageBar>
      {bannerMessage}
    </MessageBar>
  );

}

export default BannerNotification