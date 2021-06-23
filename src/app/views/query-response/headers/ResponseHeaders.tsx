
import { IconButton } from 'office-ui-fabric-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IQuery } from '../../../../types/query-runner';
import { IRootState } from '../../../../types/root';
import { sanitizeQueryUrl } from '../../../utils/query-url-sanitization';

import { Monaco } from '../../common';
import { genericCopy } from '../../common/copy';
import { convertVhToPx, getResponseHeight } from '../../common/dimensions-adjustment';

const ResponseHeaders = () => {
  const { dimensions: { response }, graphResponse, responseAreaExpanded, sampleQuery } = useSelector((state: IRootState) => state);
  const { headers } = graphResponse;

  const height = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 100);

  if (headers) {
    return (
      <div>
        <IconButton
          style={{ float: 'right', zIndex: 1 }}
          iconProps={{ iconName: 'copy' }}
          onClick={
            async () => {
              genericCopy(JSON.stringify(headers));
              trackResponseHeadersCopyEvent(sampleQuery);
            }}
        />
        <Monaco body={headers} height={height} />
      </div>
    );
  }

  return (
    <div />
  );
};

function trackResponseHeadersCopyEvent(query: IQuery) {
  if (!query) {
    return;
  }
  const sanitizedUrl = sanitizeQueryUrl(query.sampleUrl);
  telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT,
    {
      ComponentName: componentNames.RESPONSE_HEADERS_COPY_BUTTON,
      QuerySignature: `${query.selectedVerb} ${sanitizedUrl}`
    });
}

export default ResponseHeaders;
