import React from 'react';
import { Label, SearchBox, DetailsList, SelectionMode, DetailsListLayoutMode } from 'office-ui-fabric-react';
import { FormattedMessage } from 'react-intl';

import { generatePermissionGroups } from './util';
import { dynamicSort } from '../../../../utils/dynamic-sort';
import { SortOrder } from '../../../../../types/enums';

const PanelList = ({ messages, permissions, columns, classes, selection, renderItemColumn, searchValueChanged }: any) => {
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
        onChange={searchValueChanged}
        styles={{ field: { paddingLeft: 10 } }}
      />
      <hr />
      <DetailsList
        items={permissions}
        columns={columns}
        groups={groups}
        onRenderItemColumn={renderItemColumn}
        selectionMode={SelectionMode.multiple}
        layoutMode={DetailsListLayoutMode.justified}
        selection={selection}
        compact={true}
        groupProps={{
          showEmptyGroups: false,
        }}
        ariaLabelForSelectionColumn='Toggle selection'
        ariaLabelForSelectAllCheckbox='Toggle selection for all items'
        checkButtonAriaLabel='Row checkbox'
      />
    </>
  );
}
export default PanelList;