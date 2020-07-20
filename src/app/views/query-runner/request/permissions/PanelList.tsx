import { DetailsList, DetailsListLayoutMode, IColumn, Label, SearchBox, SelectionMode } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { SortOrder } from '../../../../../types/enums';
import { IPermission } from '../../../../../types/permissions';
import { dynamicSort } from '../../../../utils/dynamic-sort';
import { generatePermissionGroups } from './util';

interface IPanelList {
  messages: any;
  permissions: IPermission[];
  columns: any[];
  classes: any;
  selection: any;
  renderItemColumn: any;
  searchValueChanged: Function;
}

const PanelList = ({ messages, permissions,
  columns, classes, selection,
  renderItemColumn, searchValueChanged }: IPanelList) => {

  const groups = generatePermissionGroups(permissions);
  permissions = permissions.sort(dynamicSort('value', SortOrder.ASC));

  return (
    <>
      <Label className={classes.permissionText}>
        <FormattedMessage id='Select different permissions' />
      </Label>
      <hr />
      <SearchBox
        className={classes.searchBox}
        placeholder={messages['Search permissions']}
        onChange={(event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) =>
          searchValueChanged(event, newValue)}
        styles={{ field: { paddingLeft: 10 } }}
      />
      <hr />
      <DetailsList
        onShouldVirtualize={() => false}
        items={permissions}
        columns={columns}
        groups={groups}
        onRenderItemColumn={(item?: any, index?: number, column?: IColumn) => renderItemColumn(item, index, column)}
        selectionMode={SelectionMode.multiple}
        layoutMode={DetailsListLayoutMode.justified}
        selection={selection}
        compact={true}
        groupProps={{
          showEmptyGroups: false,
        }}
        ariaLabelForSelectionColumn={messages['Toggle selection'] || 'Toggle selection'}
        ariaLabelForSelectAllCheckbox={messages['Toggle selection for all items'] || 'Toggle selection for all items'}
        checkButtonAriaLabel={messages['Row checkbox'] || 'Row checkbox'}
      />
    </>
  );
};
export default PanelList;