import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip
} from '@fluentui/react-components';
import { Delete24Regular, Edit24Regular } from '@fluentui/react-icons';
import { translateMessage } from '../../../../utils/translate-messages';
import { IHeadersListControl } from '../../../../../types/request';
import { useHeaderStyles } from './Headers.styles';

const HeadersList = ({ handleOnHeaderDelete, headers, handleOnHeaderEdit }: IHeadersListControl) => {
  const styles = useHeaderStyles();

  const columns = [
    { key: 'key', name: translateMessage('Key'), fieldName: 'name' },
    { key: 'value', name: translateMessage('Value'), fieldName: 'value' },
    { key: 'button', name: translateMessage('actions'), fieldName: 'button' }
  ];

  const headerItems = headers ? headers.filter(h => h.value !== '') : [];

  const renderItemColumn = (item: any, colKey: string) => {
    if (colKey === 'button') {
      return (
        <div className={styles.actionButtons}>
          <Tooltip content={translateMessage('Remove request header')} relationship='label'>
            <Button
              icon={<Delete24Regular />}
              appearance='subtle'
              aria-label={translateMessage('Remove request header')}
              onClick={() => handleOnHeaderDelete(item)}
            />
          </Tooltip>
          <Tooltip content={translateMessage('Edit request header')} relationship='label'>
            <Button
              icon={<Edit24Regular />}
              appearance='subtle'
              aria-label={translateMessage('Edit request header')}
              onClick={() => handleOnHeaderEdit(item)}
            />
          </Tooltip>
        </div>
      );
    }
    return <div className={styles.itemContent}>{item[colKey]}</div>;
  };

  return (
    <div className={styles.container}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHeaderCell key={col.key}>{col.name}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {headerItems.map((item, idx) => (
            <TableRow key={idx} className={styles.rowContainer}>
              {columns.map(col => (
                <TableCell key={col.key}>
                  {renderItemColumn(item, col.fieldName)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HeadersList;
