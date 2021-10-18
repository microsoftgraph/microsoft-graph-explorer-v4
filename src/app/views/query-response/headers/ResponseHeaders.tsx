
import { IconButton, MessageBar, MessageBarType } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { RESPONSE_HEADERS_COPY_BUTTON } from '../../../../telemetry/component-names';
import { IRootState } from '../../../../types/root';
import { translateMessage } from '../../../utils/translate-messages';

import { Monaco } from '../../common';
import { trackedGenericCopy } from '../../common/copy';
import { convertVhToPx, getResponseHeight } from '../../common/dimensions-adjustment';

const ResponseHeaders = () => {
  const { dimensions: { response }, graphResponse, responseAreaExpanded, sampleQuery } =
    useSelector((state: IRootState) => state);
  const { body, headers } = graphResponse;

  const height = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 100);

  const responseIsDownloadUrl = body?.contentDownloadUrl;
  if (!headers && responseIsDownloadUrl) {
    return (
      <MessageBar messageBarType={MessageBarType.warning}>
        <FormattedMessage id={'Missing response headers for query workaround'} />
      </MessageBar>
    )
  }

  if (headers) {
    return (
      <div className='response-headers-body'>
        <IconButton
          style={{ float: 'right', zIndex: 1 }}
          ariaLabel={translateMessage('Copy')}
          iconProps={{ iconName: 'copy' }}
          onClick={
            async () =>
              trackedGenericCopy(
                JSON.stringify(headers),
                RESPONSE_HEADERS_COPY_BUTTON,
                sampleQuery)}
        />
        <Monaco body={headers} height={height} />
      </div>
    );
  }

  return (
    <div />
  );
};

export default ResponseHeaders;
