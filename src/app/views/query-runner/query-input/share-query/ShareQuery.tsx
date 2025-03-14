import React from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
  tokens
} from '@fluentui/react-components';

import { useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { sanitizeQueryUrl } from '../../../../utils/query-url-sanitization';
import { translateMessage } from '../../../../utils/translate-messages';
import { copy } from '../../../common/copy';
import { createShareLink } from '../../../common/share';
import { CopyButton } from '../../../common/lazy-loader/component-registry';

const useStyles = makeStyles({
  textArea: {
    width: '90%',
    minHeight: '63px',
    wordWrap: 'break-word',
    fontFamily: 'monospace',
    fontSize: tokens.fontSizeBase200,
    margin: '20px auto'
  }
});

const ShareQuery: React.FC<PopupsComponent<null>> = (props) => {
  const styles = useStyles();
  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const query = { ...sampleQuery };
  const sanitizedQueryUrl = sanitizeQueryUrl(query.sampleUrl);
  const shareLink = createShareLink(sampleQuery);

  const handleCopy = async () => {
    await copy('share-query-text');
    trackCopyEvent();
  };

  const trackCopyEvent = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SHARE_QUERY_COPY_BUTTON,
      QuerySignature: `${query.selectedVerb} ${sanitizedQueryUrl}`
    });
  };

  return (
    <>
      <DialogContent>
        <textarea
          id="share-query-text"
          className={styles.textArea}
          defaultValue={shareLink}
          aria-label={translateMessage('Share Query')}
        />
      </DialogContent>

      <DialogActions>
        <CopyButton handleOnClick={handleCopy} isIconButton={false} />
        <Button appearance="secondary" onClick={() => props.dismissPopup()}>
          {translateMessage('Close')}
        </Button>
      </DialogActions>
    </>
  );
};

export default ShareQuery;
