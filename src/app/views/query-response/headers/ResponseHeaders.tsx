
import { IconButton } from 'office-ui-fabric-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { Monaco } from '../../common';
import { genericCopy } from '../../common/copy';
import { convertVhToPx } from '../../common/dimensions-adjustment';

const ResponseHeaders = () => {
  const { dimensions: { response }, graphResponse, responseAreaExpanded } = useSelector((state: any) => state);
  const { headers } = graphResponse;

  let responseHeight = response.height;
  if (responseAreaExpanded) {
    responseHeight = '90vh';
  }
  const height = convertVhToPx(responseHeight, 100);

  if (headers) {
    return (
      <div>
        <IconButton
          style={{ float: 'right', zIndex: 1 }}
          iconProps={{ iconName: 'copy' }}
          onClick={async () => genericCopy(JSON.stringify(headers))}
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
