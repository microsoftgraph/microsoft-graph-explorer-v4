import * as React from 'react';
import {
  Checkbox,
  Label,
  Tooltip,
  Badge,
  DrawerBody,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  mergeClasses
} from '@fluentui/react-components';
import { ResourcePath } from '../../../../../types/resources';
import { formatScopeLabel, scopeOptions } from './collection.util';
import { PERMS_SCOPE } from '../../../../services/graph-constants';
import pathStyles from './Paths.styles';
import { METHOD_COLORS } from '../../sidebar-utils/SidebarUtils';
import { translateMessage } from '../../../../utils/translate-messages';
import { handleShiftArrowSelection } from '../resourcelink.utils';

interface IPathProps {
  resources: ResourcePath[];
  columns: {
    key: string;
    name: string;
    fieldName: string;
    minWidth: number;
    maxWidth: number;
    isResizable: boolean;
  }[];
  isSelectable?: boolean;
  onSelectionChange?: (selectedItems: ResourcePath[]) => void;
}

const Paths: React.FC<IPathProps> = ({ resources, columns, isSelectable, onSelectionChange }) => {
  const styles = pathStyles();
  const [selection, setSelection] = React.useState<Set<ResourcePath>>(new Set());
  const [allSelected, setAllSelected] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
  const [anchorIndex, setAnchorIndex] = React.useState<number | null>(null);

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
    column: {
      key: string;
      name: string;
      fieldName: string;
      minWidth: number;
      maxWidth: number;
      isResizable: boolean;
    }
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
              aria-label={`${translateMessage('Http method')} ${item.method} ${translateMessage('for')}`}>
              {item.method}
            </Badge></span>}
            {`/${item.version}${item.url}`}
          </span>
        </Tooltip>
      );
    }
  };

  return (
    <Table className={styles.table} aria-label={translateMessage('Resources available')}
      aria-rowcount={resources.length}>
      <TableHeader>
        <TableRow>
          {isSelectable && (
            <TableHeaderCell
              aria-label={translateMessage('Select collection queries')}
              aria-live='polite'
            >
              <Tooltip
                content={translateMessage('Select all')}
                relationship="label"
                withArrow
              >
                <Checkbox
                  aria-label={translateMessage('Select all')}
                  aria-live='polite'
                  checked={allSelected}
                  onChange={handleSelectAllChange}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      handleSelectAllChange();
                    }
                  }}
                />
              </Tooltip>
            </TableHeaderCell>
          )}
          {columns.map((column) => (
            <TableHeaderCell
              className={styles.tableHeader}
              key={column.key}
              aria-label={translateMessage(column.key)}
              aria-live='polite'
              style={{
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
                width: column.minWidth,
                textAlign: column.key === 'scope' ? 'right' : 'left'
              }}
            >
              {column.name}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {resources.map((resource, index) => (
          <TableRow
            key={resource.key}
            tabIndex={0}
            className={mergeClasses(styles.row, focusedIndex === index && styles.rowFocused)}
            aria-rowindex={index + 1}
            aria-label={`${translateMessage('Http method')} ${resource.method || ''}
              /${translateMessage('version')}${resource.version}${translateMessage('url')}
              ${resource.url} ${translateMessage('scope')}${
            formatScopeLabel(resource.scope as PERMS_SCOPE ?? scopeOptions[0].key)
          }`}
            onClick={(e: React.MouseEvent) => {
              if ((e.target as HTMLElement).tagName !== 'INPUT') {
                const isShiftPressed = e.shiftKey;
                if (isShiftPressed && anchorIndex !== null) {
                  const { newFocusedIndex, newAnchorIndex, newSelection } = handleShiftArrowSelection({
                    targetIndex: index,
                    focusedIndex,
                    anchorIndex,
                    items: resources,
                    currentSelection: selection
                  });
                  setSelection(newSelection);
                  onSelectionChange?.(Array.from(newSelection));
                  setFocusedIndex(newFocusedIndex);
                  setAnchorIndex(newAnchorIndex);
                } else {
                  setFocusedIndex(index);
                  setAnchorIndex(index);
                }
              }
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.shiftKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp') &&
              focusedIndex !== null &&
              anchorIndex !== null
              ) {
                e.preventDefault();
                const { newFocusedIndex, newAnchorIndex, newSelection } = handleShiftArrowSelection({
                  direction: e.key === 'ArrowDown' ? 'down' : 'up',
                  focusedIndex,
                  anchorIndex,
                  items: resources,
                  currentSelection: selection
                });
                setSelection(newSelection);
                onSelectionChange?.(Array.from(newSelection));
                setFocusedIndex(newFocusedIndex);
                setAnchorIndex(newAnchorIndex);
              }
            }}>
            {isSelectable && (
              <TableCell id='select-item' aria-label={translateMessage('Select item')} className={styles.checkbox}>
                <Checkbox
                  aria-labelledby='select-item'
                  checked={selection.has(resource)}
                  onChange={(e) => {
                    const isShiftPressed = (e.nativeEvent as PointerEvent).shiftKey;
                    if (isShiftPressed && anchorIndex !== null) {
                      const { newFocusedIndex, newAnchorIndex, newSelection } = handleShiftArrowSelection({
                        targetIndex: index,
                        focusedIndex,
                        anchorIndex,
                        items: resources,
                        currentSelection: selection
                      });
                      setSelection(newSelection);
                      onSelectionChange?.(Array.from(newSelection));
                      setFocusedIndex(newFocusedIndex);
                      setAnchorIndex(newAnchorIndex);
                    } else {
                      handleSelectionChange(resource);
                      setFocusedIndex(index);
                      setAnchorIndex(index);
                    }
                  }}
                  onFocus={() => {
                    setFocusedIndex(index);
                    setAnchorIndex(anchorIndex === null ? index : anchorIndex);
                  }}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      handleSelectionChange(resource);
                    }
                    if (e.shiftKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                      e.preventDefault();
                      const { newFocusedIndex, newAnchorIndex, newSelection } = handleShiftArrowSelection({
                        direction: e.key === 'ArrowDown' ? 'down' : 'up',
                        focusedIndex,
                        anchorIndex,
                        items: resources,
                        currentSelection: selection
                      });
                      setSelection(newSelection);
                      onSelectionChange?.(Array.from(newSelection));
                      setFocusedIndex(newFocusedIndex);
                      setAnchorIndex(newAnchorIndex);
                    }
                  }}
                />
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell key={column.key}
                style={{
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth,
                  width: column.minWidth
                }}
                aria-label={column.key === 'url' ?
                  `${translateMessage('Http method')} ${resource.method || ''} /${translateMessage('version')}` +
                  `${resource.version}${translateMessage('url')} ${resource.url}` :
                  `${translateMessage('scope')}
                  ${formatScopeLabel(resource.scope as PERMS_SCOPE ?? scopeOptions[0].key)}`
                }
              >
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