import {
  IconButton, IIconProps, ITooltipHostStyles, TooltipHost
} from '@fluentui/react';

import { usePopups } from '../../../../services/hooks';
import { translateMessage } from '../../../../utils/translate-messages';
import { styles } from '../auto-complete/suffix/suffix.styles';

const ShareButton = () => {

  const { show: showShareQuery } = usePopups('share-query', 'dialog');

  const iconProps: IIconProps = {
    iconName: 'Share'
  }

  const shareButtonStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };

  const content = <div style={{ padding: '3px' }}>{translateMessage('Share Query')}</div>
  const calloutProps = {
    gapSpace: 0
  };

  return (
    <div>
      <TooltipHost
        content={content}
        calloutProps={calloutProps}
        styles={shareButtonStyles}
      >
        <IconButton
          onClick={() => showShareQuery({
            settings: {
              title: translateMessage('Share Query'),
              subtitle: translateMessage('Share Query Message')
            }
          })}
          iconProps={iconProps}
          className={styles.iconButton}
          ariaLabel={translateMessage('Share Query')}
        />
      </TooltipHost>
    </div>
  )
}

export default ShareButton;