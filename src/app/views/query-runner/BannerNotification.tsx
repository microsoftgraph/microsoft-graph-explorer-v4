import { MessageBar, MessageBarType } from '@fluentui/react';

import { translateMessage } from '../../utils/translate-messages';
import MessageDisplay from '../common/message-display/MessageDisplay';

const BannerNotification = () => {
  const bannerMessage = translateMessage('Banner message');

  return (
    <MessageBar messageBarType={MessageBarType.warning}>
      <MessageDisplay message={bannerMessage} />
    </MessageBar>
  );

}

export default BannerNotification