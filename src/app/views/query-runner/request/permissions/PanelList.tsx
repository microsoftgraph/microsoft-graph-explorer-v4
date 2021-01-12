import {
  Announced,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  Label,
  SearchBox,
  SelectionMode
} from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { SortOrder } from '../../../../../types/enums';
import { IPermission } from '../../../../../types/permissions';
import { dynamicSort } from '../../../../utils/dynamic-sort';
import { generateGroupsFromList } from '../../../../utils/generate-groups';

interface IPanelList {
  messages: any;
  permissions: IPermission[];
  columns: any[];
  classes: any;
  selection: any;
  renderItemColumn: any;
  searchValueChanged: Function;
  renderDetailsHeader: Function;
}

const PanelList = ({ messages, permissions,
  columns, classes, selection,
  renderItemColumn, searchValueChanged, renderDetailsHeader }: IPanelList) => {

  const permissionsList: any[] = [];
  permissions.forEach(perm => {
    const permission: any = {...perm};
    const permissionValue = permission.value;
    const groupName = permissionValue.split('.')[0];
    permission.groupName = groupName;
    permissionsList.push(permission);
  });

  const groups = generateGroupsFromList(permissionsList, 'groupName');
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
      <Announced message={`${permissions.length} search results available.`}/>
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
        onRenderDetailsHeader={(props?: any, defaultRender?: any) => renderDetailsHeader(props, defaultRender)}
      />
    </>
  );
};
export default PanelList;