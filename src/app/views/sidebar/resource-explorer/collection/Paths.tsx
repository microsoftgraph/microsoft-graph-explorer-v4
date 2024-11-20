import { Checkbox, Label, TooltipHost, getId, mergeStyles } from '@fluentui/react';
import {
  DetailsList, DetailsListLayoutMode,
  IColumn, Selection
} from '@fluentui/react/lib/DetailsList';
import { Component } from 'react';

import { ResourcePath } from '../../../../../types/resources';
import { formatScopeLabel, scopeOptions } from './collection.util';
import { PERMS_SCOPE } from '../../../../services/graph-constants';

interface IPathProps {
  resources: ResourcePath[];
  columns: IColumn[];
  isSelectable?: boolean;
  onSelectionChange?: (selectedItems: ResourcePath[]) => void;
}

const scopeLabelClass = mergeStyles({
  backgroundColor: '#616161',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '16px',
  fontSize: '12px',
  display: 'inline-block',
  textAlign: 'center'
});

export default class Paths extends Component<IPathProps> {
  private _selection: Selection | null = null;

  constructor(props: IPathProps) {
    super(props);

    if(props.isSelectable) {
      this._selection = new Selection({
        onSelectionChanged: () => {
          const selected = this._selection!.getSelection() as ResourcePath[];
          props.onSelectionChange && props.onSelectionChange(selected);
        }
      });
    }
  }

  private renderCustomCheckbox = (props: any): JSX.Element => {
    return (
      <div style={{ pointerEvents: 'none' }}>
        <Checkbox checked={props ? props.checked : false} />
      </div>
    );
  };

  private renderItemColumn = (item: ResourcePath, index: number | undefined, column: IColumn | undefined) => {

    if (column) {
      if (column.key === 'scope') {
        return <Label className={scopeLabelClass}>
          {formatScopeLabel(item.scope as PERMS_SCOPE ?? scopeOptions[0].key as PERMS_SCOPE)}
        </Label>
      }
      return (
        <TooltipHost
          tooltipProps={{
            content: item.url
          }}
          id={getId()}
          calloutProps={{ gapSpace: 0 }}
          styles={{ root: { display: 'inline-block' } }}
        >
          <span
            style={{
              fontWeight: 'bold',
              display: 'inline-block',
              minWidth: '55px',
              textTransform: 'uppercase'
            }}
          >
            {item.method}
          </span>
          {`/${item.version}${item.url}`}
        </TooltipHost>
      );
    }
  }

  public render(): JSX.Element {
    const { resources, columns, isSelectable } = this.props;
    return (
      <div style={{ height: '80vh', overflowY: 'auto', overflowX: 'hidden' }}>
        <DetailsList
          items={resources}
          columns={columns}
          setKey='set'
          onRenderItemColumn={this.renderItemColumn}
          layoutMode={DetailsListLayoutMode.justified}
          selection={isSelectable ? this._selection! : undefined}
          selectionMode={isSelectable ? 2 : 0}
          onShouldVirtualize={() => false}
          checkboxVisibility={isSelectable ? 1 : 0}
          onRenderCheckbox={this.renderCustomCheckbox}
        />
      </div>
    );
  }
}
