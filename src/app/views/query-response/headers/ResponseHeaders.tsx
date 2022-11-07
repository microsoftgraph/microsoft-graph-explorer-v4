
import React from 'react';
import { RESPONSE_HEADERS_COPY_BUTTON } from '../../../../telemetry/component-names';

import { Monaco } from '../../common';
import { trackedGenericCopy } from '../../common/copy';
import { convertVhToPx, getResponseHeight } from '../../common/dimensions/dimensions-adjustment';
import { CopyButton } from '../../common/copy/CopyButton';
import { useAppSelector } from '../../../../store';

const ResponseHeaders = () => {
  const { dimensions: { response }, graphResponse, responseAreaExpanded, sampleQuery } =
    useAppSelector((state) => state);
  const { headers } = graphResponse;

  const height = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 100);

  const handleCopy = async () => trackedGenericCopy(JSON.stringify(headers), RESPONSE_HEADERS_COPY_BUTTON, sampleQuery)

  if (headers) {
    return (
      <>
        <CopyButton
          handleOnClick={handleCopy}
          isIconButton={true}
          style={{ float: 'right', zIndex: 1 }}
        />
        <Monaco body={headers} height={height} />
      </>
    );
  }

  return (
    <div />
  );
};

export default ResponseHeaders;
