import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableCellActions,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  useId
} from '@fluentui/react-components';
import { DeleteRegular, EditRegular } from '@fluentui/react-icons';
import { IHeadersListControl } from '../../../../../types/request';
import { translateMessage } from '../../../../utils/translate-messages';

const columns = [
  {
    key: 'key',
    name: translateMessage('Key')
  },
  {
    key: 'value',
    name: translateMessage('Value')
  }
];

const HeadersList = ({
  handleOnHeaderDelete,
  headers,
  handleOnHeaderEdit
}: IHeadersListControl) => {
  const headerItems = headers
    ? headers.filter((header) => header.value !== '')
    : [];

  return (
    <Table size='small' arial-label={translateMessage('request header')}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHeaderCell key={column.key}>
              <Text weight='bold'>{column.name}</Text>
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {headerItems.map((item) => (
          <TableRow key={useId(item.name)}>
            <TableCell>{item.name}</TableCell>
            <TableCell>
              {item.value}
              <TableCellActions>
                <Button
                  appearance='transparent'
                  onClick={() => handleOnHeaderDelete(item)}
                  icon={<DeleteRegular />}
                  aria-label={translateMessage('Remove request header')}
                ></Button>
                <Button
                  appearance='transparent'
                  onClick={() => handleOnHeaderEdit(item)}
                  icon={<EditRegular />}
                  aria-label={translateMessage('Edit request header')}
                ></Button>
              </TableCellActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HeadersList;
