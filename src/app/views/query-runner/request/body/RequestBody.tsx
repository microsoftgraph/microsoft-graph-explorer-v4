import { FocusZone } from '@fluentui/react';
import React from 'react';
import { useAppSelector } from '../../../../../store';

import { Monaco } from '../../../common';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';

const RequestBody = ({ handleOnEditorChange }: any) => {
  const { dimensions: { request: { height } }, sampleQuery } = useAppSelector((state) => state);

  return (
    <FocusZone>
      <Monaco
        body={sampleQuery.sampleBody}
        height={convertVhToPx(height, 60)}
        onChange={(value) => handleOnEditorChange(value)} />
    </FocusZone>

  );
};

export default RequestBody;
