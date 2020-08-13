import { DetailsList, DetailsRow, IColumn, IconButton, SelectionMode } from 'office-ui-fabric-react';
import * as React from 'react';
import { IHeadersListControl } from '../../../../../types/request';
import { headerStyles } from './Headers.styles';


const HeadersList = ({
  handleOnHeaderDelete,
  headers,
  messages
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
    { key: 'key', name: messages.Key, fieldName: 'name', minWidth: 300, maxWidth: 400 },
    { key: 'value', name: messages.Value, fieldName: 'value', minWidth: 300, maxWidth: 400 },
    { key: 'button', name: '', fieldName: 'button', minWidth: 200, maxWidth: 300 }
  ];

  const headerItems = (headers) ? headers.filter((header) => {
    return header.value !== '';
  }) : [];

  const headersList: any = headerStyles().headersList;

  return (
    <div style={headersList}>
      <DetailsList
        items={headerItems}
        columns={columns}
        onRenderItemColumn={renderItemColumn}
        onRenderRow={renderRow}
        selectionMode={SelectionMode.none}
      />
    </div>
  );
};

export default HeadersList;
