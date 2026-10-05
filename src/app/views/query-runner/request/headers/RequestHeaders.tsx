import { Button, Input, Label, makeStyles, tokens, useId } from '@fluentui/react-components';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../../store';
import { setSampleQuery } from '../../../../services/slices/sample-query.slice';
import { translateMessage } from '../../../../utils/translate-messages';
import HeadersList from './HeadersList';

interface IHeader {
  name: string;
  value: string;
}

const useStyles = makeStyles({
  container: {
    textAlign: 'center',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    maxHeight:'100%'
  },
  row: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    alignItems: 'flex-end',
    flexShrink: 0
  },
  column: {
    display: 'flex',
    gap: tokens.spacingHorizontalSNudge,
    flexDirection: 'column'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: tokens.spacingVerticalXXS,
    flex:1
  },
  input: {
    width: '100%'
  },
  button: {
    flexShrink: 0,
    minWidth: '80px'
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: '15vh',
    minHeight: 0,
    width: '100%'
  }
});

const RequestHeaders = () => {
  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const mobileScreen = useAppSelector(
    (state) => state.sidebarProperties.mobileScreen
  );
  const [header, setHeader] = useState<IHeader>({ name: '', value: '' });
  const [isUpdatingHeader, setIsUpdatingHeader] = useState(false);
  const [isHoverOverHeadersList, setIsHoverOverHeadersList] = useState(false);

  const dispatch = useAppDispatch();
  const styles = useStyles();
  const keyInputId = useId('request-header-key');
  const valueInputId = useId('request-header-value');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeader({ ...header, [e.target.name]: e.target.value });
  };

  const handleAddHeader = () => {
    if (header.name.trim() && header.value.trim()) {
      const updatedHeaders = [header, ...(sampleQuery.sampleHeaders || [])];
      dispatch(
        setSampleQuery({ ...sampleQuery, sampleHeaders: updatedHeaders })
      );
      setHeader({ name: '', value: '' });
      setIsUpdatingHeader(false);
    }
  };

  const handleDeleteHeader = (headerToDelete: IHeader) => {
    const updatedHeaders = sampleQuery.sampleHeaders.filter(
      (h) => h.name !== headerToDelete.name
    );
    dispatch(setSampleQuery({ ...sampleQuery, sampleHeaders: updatedHeaders }));
  };

  const handleEditHeader = (headerToEdit: IHeader) => {
    setHeader(headerToEdit);
    setIsUpdatingHeader(true);
    const updatedHeaders = sampleQuery.sampleHeaders.filter(
      (h: { name: string }) => h.name !== headerToEdit.name
    );
    dispatch(setSampleQuery({ ...sampleQuery, sampleHeaders: updatedHeaders }));
  };

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setIsHoverOverHeadersList(true)}
      onMouseLeave={() => setIsHoverOverHeadersList(false)}
    >
      <div className={mobileScreen ? styles.column : styles.row}>
        <div className={styles.field}>
          <Label htmlFor={keyInputId}>{translateMessage('Header Key')}</Label>
          <Input
            id={keyInputId}
            className={styles.input}
            name='name'
            value={header.name}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.field}>
          <Label htmlFor={valueInputId}>{translateMessage('Header Value')}</Label>
          <Input
            id={valueInputId}
            className={styles.input}
            name='value'
            value={header.value}
            onChange={handleInputChange}
          />
        </div>
        <Button
          className={styles.button}
          appearance='primary'
          onClick={handleAddHeader}
          disabled={!header.name.trim() || !header.value.trim()}
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
