import { FocusZone } from '@fluentui/react';
import { useAppSelector } from '../../../../../store';

import { Monaco } from '../../../common';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';

interface IRequestBodyProps {
  handleOnEditorChange: (v: string | undefined)=> void;
}

const RequestBody = ({ handleOnEditorChange }: IRequestBodyProps) => {
  const height = useAppSelector((state)=> state.dimensions.request.height);
  const sampleBody = useAppSelector((state)=> state.sampleQuery.sampleBody);

  return (
    <FocusZone>
      <Monaco
        body={sampleBody}
        height={convertVhToPx(height, 60)}
        onChange={(value) => handleOnEditorChange(value)} />
    </FocusZone>

  );
};

export default RequestBody;
