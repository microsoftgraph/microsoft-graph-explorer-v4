import React from 'react';
import { useSelector } from 'react-redux';

import { IRootState } from '../../../../../types/root';
import { Monaco } from '../../../common';
import { convertVhToPx } from '../../../common/dimensions-adjustment';

const RequestBody = ({ handleOnEditorChange }: any) => {
  const { dimensions: { request: { height } }, sampleQuery } = useSelector((state: IRootState) => state);

  return (
    <Monaco
      body={sampleQuery.sampleBody}
      height={convertVhToPx(height, 60)}
      onChange={(value) => handleOnEditorChange(value)} />
  );
};

export default RequestBody;
