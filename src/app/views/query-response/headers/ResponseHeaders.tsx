
import { IconButton } from 'office-ui-fabric-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RESPONSE_HEADERS_COPY_BUTTON } from '../../../../telemetry/component-names';
import { IRootState } from '../../../../types/root';

import { Monaco } from '../../common';
import { trackedGenericCopy } from '../../common/copy';
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
