import { DetailsList, DetailsListLayoutMode, Label, SearchBox, SelectionMode } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { SortOrder } from '../../../../../types/enums';
import { dynamicSort } from '../../../../utils/dynamic-sort';
import { generatePermissionGroups } from './util';


const PanelList = ({ messages, permissions,
  columns, classes, selection,
  renderItemColumn, searchValueChanged }: any) => {
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
        ariaLabelForSelectionColumn={messages['Toggle selection'] || 'Toggle selection'}
        ariaLabelForSelectAllCheckbox={messages['Toggle selection for all items'] || 'Toggle selection for all items'}
        checkButtonAriaLabel={messages['Row checkbox'] || 'Row checkbox'}
      />
    </>
  );
};
export default PanelList;