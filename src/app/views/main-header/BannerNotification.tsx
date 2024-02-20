import { MessageBar } from '@fluentui/react';
import { useState } from 'react';

import { BANNERMESSAGE } from '../../services/variant-constants';
import variantService from '../../services/variant-service';

const BannerNotification = () => {
  const [bannerMessage, setBannerMessage] = useState('');

  setTimeout(() => {
    const value = variantService.getFeatureVariables('default', BANNERMESSAGE) as string;
    if (value && value !== ' ') {
      setBannerMessage(value);
    }
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