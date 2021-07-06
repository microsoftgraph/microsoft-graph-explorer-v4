import { DetailsList, DetailsRow, IColumn, IconButton, SelectionMode } from 'office-ui-fabric-react';
import * as React from 'react';
import { IHeadersListControl } from '../../../../../types/request';
import { translateMessage } from '../../../../utils/translate-messages';
import { headerStyles } from './Headers.styles';


const HeadersList = ({
  handleOnHeaderDelete,
  headers
}: IHeadersListControl) => {

  const renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    const itemContent: any = headerStyles().itemContent;
    if (column) {
      const fieldContent = item[column.fieldName as keyof any] as string;
      switch (column.key) {
        case 'button':
          return <IconButton
            iconProps={{ iconName: 'Delete' }}
            title='Remove request header'
            ariaLabel='Remove request header'
            onClick={(event) => handleOnHeaderDelete(event, item)}
          />;

        default:
          return <div style={itemContent}>{fieldContent}</div>;
      }
    }
  };

  const renderRow = (props: any): any => {
    const { detailsRow, rowContainer }: any = headerStyles();

    if (props) {
      return (
        <div style={rowContainer}>
          <DetailsRow {...props} style={detailsRow} />
        </div>
      );
    }
  };

  const columns = [
    { key: 'key', name: translateMessage('Key'), fieldName: 'name', minWidth: 300, maxWidth: 400, ariaLabel: translateMessage('Key') },
    { key: 'value', name: translateMessage('Value'), fieldName: 'value', minWidth: 300, maxWidth: 400, ariaLabel: translateMessage('Value') },
    { key: 'button', name: translateMessage('actions'), fieldName: 'button', minWidth: 200, maxWidth: 300, ariaLabel: translateMessage('actions') }
  ];

  const headerItems = (headers) ? headers.filter((header) => {
    return header.value !== '';
  }) : [];

  return (
    <DetailsList
      items={headerItems}
      columns={columns}
      onRenderItemColumn={renderItemColumn}
      onRenderRow={renderRow}
      selectionMode={SelectionMode.none}
    />
  );
};

export default HeadersList;
