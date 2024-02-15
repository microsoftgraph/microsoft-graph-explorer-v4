import { DetailsList, DetailsRow, IColumn, IconButton, SelectionMode } from '@fluentui/react';
import { IHeadersListControl } from '../../../../../types/request';
import { translateMessage } from '../../../../utils/translate-messages';
import { headerStyles } from './Headers.styles';


const HeadersList = ({
  handleOnHeaderDelete,
  headers,
  handleOnHeaderEdit
}: IHeadersListControl) => {

  const renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    const itemContent: any = headerStyles().itemContent;
    if (column) {
      const fieldContent = item[column.fieldName as keyof any] as string;
      if(column.key === 'button') {
        return <div>
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            title={translateMessage('Remove request header')}
            ariaLabel={translateMessage('Remove request header')}
            onClick={() => handleOnHeaderDelete(item)}
          />
          <span style={{fontSize: 'large', position: 'relative', bottom: '3px'}}>|</span>
          <IconButton
            iconProps={{ iconName: 'Edit' }}
            title={translateMessage('Edit request header')}
            ariaLabel={translateMessage('Edit request header')}
            onClick={() => handleOnHeaderEdit(item)}
          />
        </div>;
      }
      else{
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
    {
      key: 'key', name: translateMessage('Key'), fieldName: 'name', minWidth: 300,
      maxWidth: 400, ariaLabel: translateMessage('Key')
    },
    {
      key: 'value', name: translateMessage('Value'), fieldName: 'value', minWidth: 300,
      maxWidth: 400, ariaLabel: translateMessage('Value')
    },
    {
      key: 'button', name: translateMessage('actions'), fieldName: 'button', minWidth: 200,
      maxWidth: 300, ariaLabel: translateMessage('actions')
    }
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
      styles={{root: {height: '100%'}}}
    />
  );
};

export default HeadersList;
