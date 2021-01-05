import { DetailsList, DetailsListLayoutMode, IColumn, Label, SelectionMode } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { IPermission } from '../../../../../types/permissions';

interface ITabList {
  permissions: IPermission[];
  columns: any[];
  classes: any;
  renderItemColumn: Function;
  renderDetailsHeader: Function;
  permissionToken: boolean;
}


const TabList = ({ permissions, columns, classes, renderItemColumn, renderDetailsHeader, permissionToken }
  : ITabList) => {
  return (
    <>
      <Label className={classes.permissionLength}>
        <FormattedMessage id='Permissions' />&nbsp;({permissions.length})
      </Label>
      <Label className={classes.permissionText}>
        {!permissionToken && <FormattedMessage id='sign in to consent to permissions' />}
        {permissionToken && <FormattedMessage id='permissions required to run the query' />}
      </Label>
      <DetailsList styles={{ root: { minHeight: '300px' } }}
        items={permissions}
        columns={columns}
        onRenderItemColumn={(item?: any, index?: number, column?: IColumn) => renderItemColumn(item, index, column)}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        onRenderDetailsHeader={(props?: any, defaultRender?: any) => renderDetailsHeader(props, defaultRender)} />
    </>
  );
};

export default TabList;