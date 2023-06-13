import {
  DirectionalHint,
  IconButton, IIconProps, TooltipHost
} from '@fluentui/react';

import { usePopups } from '../../../../services/hooks';
import { translateMessage } from '../../../../utils/translate-messages';
import { shareQueryStyles } from './ShareQuery.styles';

const ShareButton = () => {

  const { show: showShareQuery } = usePopups('share-query', 'dialog');

  const iconProps: IIconProps = {
    iconName: 'Share'
  }

  const shareButtonStyles = shareQueryStyles().iconButton;

  const content = <div style={{ padding: '3px' }}>{translateMessage('Share Query')}</div>
  const calloutProps = {
    gapSpace: 0
  };

  return (
    <div>
      <TooltipHost
        content={content}
        calloutProps={calloutProps}
        directionalHint={DirectionalHint.leftBottomEdge}
      >
        <IconButton
          onClick={() => showShareQuery({
            settings: {
              title: translateMessage('Share Query'),
              subtitle: translateMessage('Share Query Message')
            }
          })}
          iconProps={iconProps}
          styles={shareButtonStyles}
          role={'button'}
          ariaLabel={translateMessage('Share Query')}
        />
      </TooltipHost>
    </div>
  )
}

export default ShareButton;