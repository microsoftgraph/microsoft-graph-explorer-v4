import { MessageBar, MessageBarType } from '@fluentui/react';
import { useState } from 'react';

import { translateMessage } from '../../utils/translate-messages';
import MessageDisplay from '../common/message-display/MessageDisplay';

const BannerNotification = () => {
  const bannerMessage = translateMessage('Banner message');
  const [visible, setMessageBarVisibility] = useState(true);

  const dismissMessageBar = () => {
    setMessageBarVisibility(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <MessageBar
      isMultiline={true}
      onDismiss={dismissMessageBar}
      dismissButtonAriaLabel={translateMessage('Close')}
      messageBarType={MessageBarType.warning}>
      <MessageDisplay message={bannerMessage} />
    </MessageBar>
  );

}

export default BannerNotification