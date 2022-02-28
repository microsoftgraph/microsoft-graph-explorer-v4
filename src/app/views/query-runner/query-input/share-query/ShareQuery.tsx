import { DefaultButton, Dialog, DialogFooter, DialogType, DirectionalHint, FontSizes,
  IconButton, IIconProps, TooltipHost } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { IRootState } from '../../../../../types/root';
import { sanitizeQueryUrl } from '../../../../utils/query-url-sanitization';
import { translateMessage } from '../../../../utils/translate-messages';
import { copy } from '../../../common/copy';
import { CopyButton } from '../../../common/copy/CopyButton';
import { createShareLink } from '../../../common/share';
import { shareQueryStyles } from './ShareQuery.styles';


export const ShareQuery = () => {
  const { sampleQuery } = useSelector((state: IRootState) => state);
  const [showShareQueryDialog, setShareQuaryDialogStatus] = useState(true);
  const [shareLink, setShareLink] = useState(() => createShareLink(sampleQuery));

  useEffect(() => {
    setShareLink(createShareLink(sampleQuery));
  }, [sampleQuery]);

  const toggleShareQueryDialogState = () => {
    setShareQuaryDialogStatus(prevState => !prevState);
  }

  const handleCopy = () => {
    copy('share-query-text');
    trackCopyEvent();
  }

  const trackCopyEvent = () => {
    const sanitizedUrl = sanitizeQueryUrl(sampleQuery.sampleUrl);
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT,
      {
        ComponentName: componentNames.SHARE_QUERY_COPY_BUTTON,
        QuerySignature: `${sampleQuery.selectedVerb} ${sanitizedUrl}`
      });
  }

  const iconProps : IIconProps = {
    iconName: 'Share'
  }

  const shareButtonStyles = shareQueryStyles().iconButton;

  const content = <div style={{padding:'3px'}}>{translateMessage('Share Query')}</div>
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
          onClick={toggleShareQueryDialogState}
          iconProps={iconProps}
          styles={shareButtonStyles}
          role={'button'}
        />
      </TooltipHost>
      <Dialog
        hidden={showShareQueryDialog}
        onDismiss={toggleShareQueryDialogState}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Share Query',
          isMultiline: true,
          subText: translateMessage('Share Query Message')
        }}
      >
        <textarea
          style={{
            wordWrap: 'break-word',
            fontFamily: 'monospace',
            fontSize: FontSizes.xSmall,
            width: '100%',
            height: 63,
            overflowY: 'scroll',
            resize: 'none',
            color: 'black'
          }}
          id='share-query-text'
          className='share-query-params'
          defaultValue={shareLink}
          aria-label={translateMessage('Share Query')}
        />
        <DialogFooter>
          <CopyButton handleOnClick={handleCopy} isIconButton={false} />
          <DefaultButton
            text={translateMessage('Close')}
            onClick={toggleShareQueryDialogState}
          />
        </DialogFooter>
      </Dialog>
    </div>
  )
}