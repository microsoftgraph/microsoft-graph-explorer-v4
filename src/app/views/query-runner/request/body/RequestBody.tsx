import { makeStyles } from '@fluentui/react-components';
import { useAppSelector } from '../../../../../store';

import { Monaco } from '../../../common';

interface IRequestBodyProps {
  handleOnEditorChange: (v: string | undefined) => void;
}

const useStyles = makeStyles({
  container: {
    padding: '0 0.5rem'
  }
});

const RequestBody = ({ handleOnEditorChange }: IRequestBodyProps) => {
  const sampleBody = useAppSelector((state) => state.sampleQuery.sampleBody);
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Monaco
        body={sampleBody}
        onChange={(value) => handleOnEditorChange(value)}
      />
    </div>
  );
};

export default RequestBody;
