import { DetailsList, DetailsListLayoutMode, Label, SelectionMode } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const TabList = ({ permissions, columns, classes, renderItemColumn }: any) => {

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
        onRenderItemColumn={renderItemColumn}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified} />
    </>
  );
};

export default TabList;