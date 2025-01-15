import { FocusZone } from '@fluentui/react';
import { useAppSelector } from '../../../../../store';

import { Monaco } from '../../../common';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';

interface IRequestBodyProps {
  handleOnEditorChange: (v: string | undefined) => void;
}

const RequestBody = ({ handleOnEditorChange }: IRequestBodyProps) => {
  const sampleBody = useAppSelector((state) => state.sampleQuery.sampleBody);

  return (
    <div>
      <Monaco
        body={sampleBody}
        onChange={(value) => handleOnEditorChange(value)}
      />
    </div>
  );
};

export default RequestBody;
