import { useAppSelector } from '../../../../../store';

import { MonacoV9 } from '../../../common';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';

interface IRequestBodyProps {
  handleOnEditorChange: (v: string | undefined)=> void;
}

const RequestBody = ({ handleOnEditorChange }: IRequestBodyProps) => {
  const height = useAppSelector((state)=> state.dimensions.request.height);
  const sampleBody = useAppSelector((state)=> state.sampleQuery.sampleBody);

  return (
    <MonacoV9
      height={'100%'}
      body={sampleBody}
      // height={convertVhToPx(height, 60)}
      onChange={(value) => handleOnEditorChange(value)} />
  );
};

export default RequestBody;
