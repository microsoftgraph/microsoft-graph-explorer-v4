import { DetailsList, DetailsListLayoutMode, IColumn, Label, SelectionMode } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { IPermission } from '../../../../../types/permissions';

interface ITabList {
  permissions: IPermission[];
  columns: any[];
  classes: any;
  renderItemColumn: Function;
  renderDetailsHeader: Function;
}


const TabList = ({ permissions, columns, classes, renderItemColumn, renderDetailsHeader }: ITabList) => {
  const tokenPresent = useSelector((state: any) => state.authToken);
  return (
    <>
      <Label className={classes.permissionLength}>
        <FormattedMessage id='Permissions' />&nbsp;({permissions.length})
      </Label>
      <Label className={classes.permissionText}>
        {!tokenPresent && <FormattedMessage id='sign in to consent to permissions' />}
        {tokenPresent && <FormattedMessage id='permissions required to run the query' />}
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