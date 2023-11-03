import { Dropdown, IDropdownOption, MarqueeSelection, TooltipHost, getId } from '@fluentui/react';
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
  selectItems: Function;
  setSelectedScope: (resource: ResourcePath, scope: string) => void;
}

export default class Paths extends Component<IPathProps> {
  private _selection: Selection;

  constructor(props: IPathProps) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => {
        const selected = this._selection.getSelection();
        this.props.selectItems(selected);
      }
    });
  }

  private renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {

    const handleOnScopeChange = (event: any, option?: IDropdownOption<ScopeOption>) => {
      this.props.setSelectedScope(item, option!.key as string)
      this.props.selectItems([]);
    };

    if (column) {
      const itemContent = item[column.fieldName as keyof any] as string;
      switch (column.key) {
        case 'scope':
          return <Dropdown
            selectedKey={item.scope || scopeOptions[0].key}
            options={scopeOptions}
            onChange={handleOnScopeChange}
            styles={{ dropdown: { width: 300 } }}
          />;
        default:
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
              {`/${item.version}${itemContent}`}
            </TooltipHost>
          );
      }
    }
  }

  public render(): JSX.Element {
    const { resources, columns } = this.props;
    return (
      <MarqueeSelection selection={this._selection}>
        <DetailsList
          items={resources}
          columns={columns}
          setKey='set'
          onRenderItemColumn={this.renderItemColumn}
          layoutMode={DetailsListLayoutMode.justified}
          selection={this._selection}
          selectionPreservedOnEmptyClick={true}
          ariaLabelForSelectionColumn='Toggle selection'
          ariaLabelForSelectAllCheckbox='Toggle selection for all items'
          checkButtonAriaLabel='select row'
          styles={{
            root: {
              maxHeight: '80vh',
              overflowY: 'auto',
              overflowX: 'hidden'
            }
          }}
          onShouldVirtualize={() => false}
        />
      </MarqueeSelection>
    );
  }
}
