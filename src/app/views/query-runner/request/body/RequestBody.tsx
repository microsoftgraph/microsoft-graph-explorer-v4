import { useAppSelector } from '../../../../../store';

import { MonacoV9 } from '../../../common';

interface IRequestBodyProps {
  handleOnEditorChange: (v: string | undefined) => void;
}

const RequestBody = ({ handleOnEditorChange }: IRequestBodyProps) => {
  const sampleBody = useAppSelector((state) => state.sampleQuery.sampleBody);

  return (
    <MonacoV9
      body={sampleBody}
      onChange={(value) => handleOnEditorChange(value)}
      height='18rem'
    />
  );
};

export default RequestBody;
