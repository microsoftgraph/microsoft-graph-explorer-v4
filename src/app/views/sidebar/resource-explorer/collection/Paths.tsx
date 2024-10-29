import { Dropdown, IDropdownOption, TooltipHost, getId } from '@fluentui/react';
import {
  DetailsList, DetailsListLayoutMode,
  IColumn, Selection
} from '@fluentui/react/lib/DetailsList';
import { Component } from 'react';

import { ResourcePath } from '../../../../../types/resources';
import { ScopeOption, scopeOptions } from './collection.util';

interface IPathProps {
  resources: ResourcePath[];
  columns: IColumn[];
  setSelectedScope: (resource: ResourcePath, scope: string) => void;
  isSelectable?: boolean; // New prop to control selection
  onSelectionChange?: (selectedItems: ResourcePath[]) => void; // Optional callback for selection changes
}

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

  private renderItemColumn = (item: ResourcePath, index: number | undefined, column: IColumn | undefined) => {
    const handleOnScopeChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<ScopeOption>) => {
      this.props.setSelectedScope(item, option?.key as string)
    };

    if (column) {
      if (column.key === 'scope') {
        return <Dropdown
          selectedKey={item.scope ?? scopeOptions[0].key}
          options={scopeOptions}
          onChange={handleOnScopeChange}
          styles={{ dropdown: { width: 300 } }}
        />;
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
          />
      </div>
    );
  }
}
