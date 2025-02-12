import { Button, Input, makeStyles } from '@fluentui/react-components';
import { useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../../store';
import { setSampleQuery } from '../../../../services/slices/sample-query.slice';
import { translateMessage } from '../../../../utils/translate-messages';
import HeadersList from './HeadersList';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';

interface IHeader {
  name: string;
  value: string;
}

const useStyles = makeStyles({
  container: {
    textAlign: 'center',
    padding: '10px',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  row: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    alignItems: 'center'
  },
  input: {
    flex: 1
  },
  button: {
    flexShrink: 0,
    minWidth: '80px'
  },
  listContainer: {
    flex: 1,
    overflow: 'auto'
  }
});

const RequestHeaders = () => {
  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const height = useAppSelector((state) => state.dimensions.request.height);
  const [header, setHeader] = useState<IHeader>({ name: '', value: '' });
  const [isUpdatingHeader, setIsUpdatingHeader] = useState(false);
  const [isHoverOverHeadersList, setIsHoverOverHeadersList] = useState(false);

  const dispatch = useAppDispatch();
  const styles = useStyles();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeader({ ...header, [e.target.name]: e.target.value });
  };

  const keyInputRef = useRef<HTMLInputElement>(null);

  const handleAddHeader = () => {
    if (header.name.trim() && header.value.trim()) {
      const updatedHeaders = [header, ...(sampleQuery.sampleHeaders || [])];
      dispatch(setSampleQuery({ ...sampleQuery, sampleHeaders: updatedHeaders }));
      setHeader({ name: '', value: '' });
      setIsUpdatingHeader(false);
    }
  };

  const handleDeleteHeader = (headerToDelete: IHeader) => {
    const updatedHeaders = sampleQuery.sampleHeaders.filter((h) => h.name !== headerToDelete.name);
    dispatch(setSampleQuery({ ...sampleQuery, sampleHeaders: updatedHeaders }));
    keyInputRef.current?.focus();
  };

  const handleEditHeader = (headerToEdit: IHeader) => {
    setHeader(headerToEdit);
    setIsUpdatingHeader(true);
    const updatedHeaders = sampleQuery.sampleHeaders.filter((h) => h.name !== headerToEdit.name);
    dispatch(setSampleQuery({ ...sampleQuery, sampleHeaders: updatedHeaders }));
  };

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setIsHoverOverHeadersList(true)}
      onMouseLeave={() => setIsHoverOverHeadersList(false)}
      style={
        isHoverOverHeadersList
          ? { height: convertVhToPx(height, 60) }
          : { height: convertVhToPx(height, 60), overflow: 'hidden' }
      }
    >
      <div className={styles.row}>
        <Input
          className={styles.input}
          placeholder={translateMessage('Key')}
          name="name"
          value={header.name}
          onChange={handleInputChange}
          ref={keyInputRef}
        />
        <Input
          className={styles.input}
          placeholder={translateMessage('Value')}
          name="value"
          value={header.value}
          onChange={handleInputChange}
        />
        <Button
          className={styles.button}
          appearance="primary"
          onClick={handleAddHeader}
        >
          {translateMessage(isUpdatingHeader ? 'Update' : 'Add')}
        </Button>
      </div>
      <div className={styles.listContainer}>
        <HeadersList
          headers={sampleQuery.sampleHeaders || []}
          handleOnHeaderDelete={handleDeleteHeader}
          handleOnHeaderEdit={handleEditHeader}
        />
      </div>
    </div>
  );
};

export default RequestHeaders;