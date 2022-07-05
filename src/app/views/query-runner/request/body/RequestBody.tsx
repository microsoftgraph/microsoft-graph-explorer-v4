import { FocusZone, FocusZoneTabbableElements } from '@fluentui/react';
import React from 'react';
import { useSelector } from 'react-redux';

import { IRootState } from '../../../../../types/root';
import { Monaco } from '../../../common';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';

const RequestBody = ({ handleOnEditorChange }: any) => {
  const { dimensions: { request: { height } }, sampleQuery } = useSelector((state: IRootState) => state);

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
