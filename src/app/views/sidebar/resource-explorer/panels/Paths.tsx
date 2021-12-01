import React, { Component } from 'react';
import {
  DetailsList, DetailsListLayoutMode,
  IColumn, Selection
} from '@fluentui/react/lib/DetailsList';
import { getId, MarqueeSelection, TooltipHost } from '@fluentui/react';

export default class Paths extends Component<any, any> {
  private _selection: Selection;

  constructor(props: any) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => {
        const selected = this._selection.getSelection();
        this.props.selectItems(selected);
      }
    });
  }

  private renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    if (column) {
      const itemContent = item[column.fieldName as keyof any] as string;
      if (column.key === 'methods') {
        return item.methods.map((method: any, key: number) => (
          <span key={key}
            style={{
              textAlign: 'center',
              display: 'inline-flex',
              marginRight: 6
            }}
          >
            {method.name}
          </span>
        ));
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
          {itemContent}
        </TooltipHost>
      );
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
        />
      </MarqueeSelection>
    );
  }
}
