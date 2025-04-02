import React, { useRef } from 'react';
import { makeStyles, Button, Tooltip } from '@fluentui/react-components';
import { Share24Regular } from '@fluentui/react-icons';

import { usePopups } from '../../../../services/hooks';
import { translateMessage } from '../../../../utils/translate-messages';

const useStyles = makeStyles({
  iconButton: {
    padding: '4px',
    minWidth: '32px'
  }
});

const ShareButton = () => {
  const classes = useStyles();
  const { show: showShareQuery } = usePopups('share-query', 'dialog');

  const handleClick = () => {
    showShareQuery({
      settings: {
        title: translateMessage('Share Query'),
        subtitle: translateMessage('Share Query Message'),
        trigger: shareTriggerBtnRef
      }
    });
  };

  const shareTriggerBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <Tooltip
      content={translateMessage('Share Query')}
      positioning="above"
      relationship="label"
    >
      <Button
        ref={shareTriggerBtnRef}
        icon={<Share24Regular />}
        className={classes.iconButton}
        appearance="subtle"
        aria-label={translateMessage('Share Query')}
        onClick={handleClick}
      />
    </Tooltip>
  );
};

export default ShareButton;
