import { useAppSelector } from '../../../../../store';

import { Monaco } from '../../../common';

interface IRequestBodyProps {
  handleOnEditorChange: (v: string | undefined) => void;
  isVisible: boolean;
}

const RequestBody = ({ handleOnEditorChange, isVisible }: IRequestBodyProps) => {
  const sampleBody = useAppSelector((state) => state.sampleQuery.sampleBody);


  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <Monaco
        body={sampleBody}
        onChange={(value) => handleOnEditorChange(value)}
        height='100%'
        isVisible={isVisible}
      />
    </div>
  );
};

export default RequestBody;
