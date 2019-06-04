import { DetailsList, IColumn, IconButton, SelectionMode } from 'office-ui-fabric-react';
import * as React from 'react';
import { IHeadersListControl } from '../../../../types/request';

const HeadersList = ({
    handleOnHeaderDelete,
    headers,
}: IHeadersListControl) => {

    const renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
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
                    return <span className='field-content'>{fieldContent}</span>;
            }
        }
    };

    const columns = [
        { key: 'key', name: 'Key', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'value', name: 'Value', fieldName: 'value', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'button', name: '', fieldName: 'button', minWidth: 100, maxWidth: 200, isResizable: true }
    ];

    const headerItems = headers.filter((header) => {
        return header.value !== '';
    });

    return (
        <div className='headers-list'>
            <DetailsList
                className='detail-list'
                items={headerItems}
                setKey='set'
                columns={columns}
                onRenderItemColumn={renderItemColumn}
                selectionMode={SelectionMode.none}
            />
        </div>
    );
};

export default HeadersList;
