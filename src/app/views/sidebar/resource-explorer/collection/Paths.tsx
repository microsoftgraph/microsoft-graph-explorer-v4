import * as React from 'react';
import { Checkbox, Label, Tooltip, Badge } from '@fluentui/react-components';
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from '@fluentui/react-components';
import { ResourcePath } from '../../../../../types/resources';
import { formatScopeLabel, scopeOptions } from './collection.util';
import { PERMS_SCOPE } from '../../../../services/graph-constants';
import pathStyles from './Paths.styles';
import { METHOD_COLORS } from '../../sidebar-utils/SidebarUtils';

interface IPathProps {
  resources: ResourcePath[];
  columns: { key: string, name: string, fieldName: string, minWidth: number, maxWidth: number, isResizable: boolean }[];
  isSelectable?: boolean;
  onSelectionChange?: (selectedItems: ResourcePath[]) => void;
}

const Paths: React.FC<IPathProps> = ({ resources, columns, isSelectable, onSelectionChange }) => {
  const styles = pathStyles();
  const [selection, setSelection] = React.useState<Set<ResourcePath>>(new Set());
  const [allSelected, setAllSelected] = React.useState(false);

  const handleSelectionChange = (item: ResourcePath) => {
    const newSelection = new Set(selection);
    if (newSelection.has(item)) {
      newSelection.delete(item);
    } else {
      newSelection.add(item);
    }
    setSelection(newSelection);
    onSelectionChange && onSelectionChange(Array.from(newSelection));
    setAllSelected(newSelection.size === resources.length);
  };

  const handleSelectAllChange = () => {
    if (allSelected) {
      setSelection(new Set());
      onSelectionChange && onSelectionChange([]);
    } else {
      const newSelection = new Set(resources);
      setSelection(newSelection);
      onSelectionChange && onSelectionChange(Array.from(newSelection));
    }
    setAllSelected(!allSelected);
  };

  const renderItemColumn = (
    item: ResourcePath,
    column: { key: string, name: string, fieldName: string, minWidth: number, maxWidth: number, isResizable: boolean }
  ) => {
    if (column.key === 'scope') {
      return (
        <Label className={styles.scopeLabel} style={{ textAlign: 'right' }}>
          {formatScopeLabel(item.scope as PERMS_SCOPE ?? scopeOptions[0].key)}
        </Label>
      );
    }
    if (column.key === 'url') {
      return (
        <Tooltip content={item.url} relationship="description" withArrow>
          <span className={styles.urlAndMethod}>
            {item.method && <span className={styles.badgeContainer}><Badge
              className={styles.badge}
              size='medium'
              color={METHOD_COLORS[item?.method]}
              aria-label={'http method ' + item.method + ' for'}>
              {item.method}
            </Badge></span>}
            {`/${item.version}${item.url}`}
          </span>
        </Tooltip>
      );
    }
  };

  return (
    <Table className={styles.table}>
      <TableHeader>
        <TableRow>
          {isSelectable && (
            <TableHeaderCell>
              <Checkbox
                checked={allSelected}
                onChange={handleSelectAllChange}
              />
            </TableHeaderCell>
          )}
          {columns.map((column) => (
            <TableHeaderCell className={styles.tableHeader} key={column.key}>{column.name}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {resources.map((resource) => (
          <TableRow key={resource.key} className={styles.row}>
            {isSelectable && (
              <TableCell>
                <Checkbox
                  checked={selection.has(resource)}
                  onChange={() => handleSelectionChange(resource)}
                />
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell key={column.key} style={{ textAlign: column.key === 'scope' ? 'right' : 'left' }}>
                {renderItemColumn(resource, column)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Paths;
