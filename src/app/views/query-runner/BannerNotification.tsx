import { FontWeights, IStackTokens, MessageBar, MessageBarType, Stack } from '@fluentui/react';

import { translateMessage } from '../../utils/translate-messages';
import MessageDisplay from '../common/message-display/MessageDisplay';

const BannerNotification = () => {
  const bannerMessage = translateMessage('Banner message');

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