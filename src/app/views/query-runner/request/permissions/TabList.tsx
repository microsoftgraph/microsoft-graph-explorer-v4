import { DetailsList, DetailsListLayoutMode, IColumn, Label, SelectionMode } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { IPermission } from '../../../../../types/permissions';

interface ITabList {
  permissions: IPermission[];
  columns: any[];
  classes: any;
  renderItemColumn: Function;
}

const TabList = ({ permissions, columns, classes, renderItemColumn }: ITabList) => {
  return (
    <>
      <Label className={classes.permissionLength}>
        <FormattedMessage id='Permissions' />&nbsp;({permissions.length})
      </Label>
      <Label className={classes.permissionText}>
        <FormattedMessage id='permissions required to run the query' />
      </Label>
      <DetailsList styles={{ root: { minHeight: '300px' } }}
        items={permissions}
        columns={columns}
        onRenderItemColumn={(item?: any, index?: number, column?: IColumn) => renderItemColumn(item, index, column)}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified} />
    </>
  );
};

export default TabList;