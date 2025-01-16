import { Checkbox, Label, Tooltip, makeStyles } from '@fluentui/react-components';
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from '@fluentui/react-components';
import { Component } from 'react';

import { ResourcePath } from '../../../../../types/resources';
import { formatScopeLabel, scopeOptions } from './collection.util';
import { PERMS_SCOPE } from '../../../../services/graph-constants';

interface IPathProps {
  resources: ResourcePath[];
  columns: { key: string, name: string, fieldName: string, minWidth: number, maxWidth: number, isResizable: boolean }[];
  isSelectable?: boolean;
  onSelectionChange?: (selectedItems: ResourcePath[]) => void;
}

export default class Paths extends Component<IPathProps> {
  readonly _selection: Set<ResourcePath> = new Set();

  constructor(props: IPathProps) {
    super(props);

    if (props.isSelectable) {
      this._selection = new Set();
    }
  }

  handleSelectionChange = (item: ResourcePath) => {
    const { onSelectionChange } = this.props;
    if (this._selection.has(item)) {
      this._selection.delete(item);
    } else {
      this._selection.add(item);
    }
    onSelectionChange && onSelectionChange(Array.from(this._selection));
  };

  readonly renderCustomCheckbox = (props: any): JSX.Element => {
    return (
      <div style={{ pointerEvents: 'none' }}>
        <Checkbox checked={props ? props.checked : false} />
      </div>
    );
  };

  readonly renderItemColumn = (
    item: ResourcePath,
    index: number | undefined,
    column: {
      key: string,
      name: string,
      fieldName: string,
      minWidth: number,
      maxWidth: number,
      isResizable: boolean
    } | undefined
  ) => {

    if (column) {
      if (column.key === 'scope') {
        return <Label weight='semibold'>
          {formatScopeLabel(item.scope as PERMS_SCOPE ?? scopeOptions[0].key)}
        </Label>
      }
      return (
        <Tooltip content={item.url} relationship="description" withArrow>
          <div>
            <Label weight='semibold'>
              {item.method}
            </Label>
            <Label>
              {`/${item.version}${item.url}`}
            </Label>
          </div>
        </Tooltip>
      );
    }
  }

  public render(): JSX.Element {
    const { resources, columns, isSelectable } = this.props;

    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              {isSelectable && <TableHeaderCell>Select</TableHeaderCell>}
              {columns.map((column) => (
                <TableHeaderCell key={column.key}>{column.name}</TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource, index) => (
              <TableRow key={resource.key}>
                {isSelectable && (
                  <TableCell>
                    <Checkbox
                      checked={this._selection.has(resource)}
                      onChange={() => this.handleSelectionChange(resource)}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {this.renderItemColumn(resource, index, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}
