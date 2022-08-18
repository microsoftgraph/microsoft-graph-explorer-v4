import { FocusZone } from '@fluentui/react';
import React from 'react';
import { useSelector } from 'react-redux';

import { IRootState } from '../../../../../types/root';
import { Monaco } from '../../../common';

const RequestBody = ({ handleOnEditorChange }: any) => {
  const { sampleQuery } = useSelector((state: IRootState) => state);

  return (
    <FocusZone>
      <Monaco
        body={sampleQuery.sampleBody}
        onChange={(value) => handleOnEditorChange(value)} />
    </FocusZone>

  );
};

export default RequestBody;
