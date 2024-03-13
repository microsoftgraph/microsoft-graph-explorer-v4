import { FontWeights, IStackTokens, MessageBar, MessageBarType, Stack } from '@fluentui/react';
import { useState } from 'react';

import { BANNERMESSAGE } from '../../services/variant-constants';
import variantService from '../../services/variant-service';
import MessageDisplay from '../common/MessageDisplay';
import { translateMessage } from '../../utils/translate-messages';

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

  const horizontalGapStackTokens: IStackTokens = {
    childrenGap: 10
  };

  return (
    <MessageBar messageBarType={MessageBarType.warning}>
      <Stack horizontal tokens={horizontalGapStackTokens}>
        <span style={{ fontWeight: FontWeights.bold, marginRight: 3 }}>{`${translateMessage('Announcement')}:`}</span>
        <MessageDisplay message={bannerMessage} />
      </Stack>
    </MessageBar>
  );

}

export default BannerNotification