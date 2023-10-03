import { DefaultButton, DialogFooter, FontSizes } from '@fluentui/react';
import React from 'react';

import { useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { sanitizeQueryUrl } from '../../../../utils/query-url-sanitization';
import { translateMessage } from '../../../../utils/translate-messages';
import { copy } from '../../../common/copy';
import { createShareLink } from '../../../common/share';
import { CopyButton } from '../../../common/lazy-loader/component-registry';

const ShareQuery: React.FC<PopupsComponent<null>> = (props) => {

  const { sampleQuery } = useAppSelector((state) => state);
  const query = { ...sampleQuery };
  const sanitizedQueryUrl = sanitizeQueryUrl(query.sampleUrl);
  const shareLink = createShareLink(sampleQuery);

  const handleCopy = async () => {
    await copy('share-query-text');
    trackCopyEvent();
  }

  const trackCopyEvent = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT,
      {
        ComponentName: componentNames.SHARE_QUERY_COPY_BUTTON,
        QuerySignature: `${query.selectedVerb} ${sanitizedQueryUrl}`
      });
  }

  return (
    <div >
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
          onClick={() => props.dismissPopup()}
        />
      </DialogFooter>
    </div>
  )
}

export default ShareQuery