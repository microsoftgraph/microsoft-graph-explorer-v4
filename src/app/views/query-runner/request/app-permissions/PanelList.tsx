import {
  Announced,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  Label,
  SearchBox,
  SelectionMode
} from 'office-ui-fabric-react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { SortOrder } from '../../../../../types/enums';
import { IPermission } from '../../../../../types/permissions';
import { IRootState } from '../../../../../types/root';
import { dynamicSort } from '../../../../utils/dynamic-sort';
import { generateGroupsFromList } from '../../../../utils/generate-groups';
import { setConsentedStatus } from './util';

interface IPanelList {
  messages: any;
  columns: any[];
  classes: any;
  selection: any;
  renderItemColumn: any;
  renderDetailsHeader: Function;
}

const PanelList = ({ messages,
  columns, classes, selection,
  renderItemColumn, renderDetailsHeader }: IPanelList) => {

  const { consentedScopes, scopes, authToken } = useSelector((state: IRootState) => state);
  const [permissions, setPermissions] = useState(scopes.data.sort(dynamicSort('value', SortOrder.ASC)));
  const permissionsList: any[] = [];
  const tokenPresent = !!authToken.token;

  setConsentedStatus(tokenPresent, permissions, consentedScopes);

  permissions.forEach((perm: any) => {
    const permission: any = { ...perm };
    const permissionValue = permission.value;
    const groupName = permissionValue.split('.')[0];
    permission.groupName = groupName;
    permissionsList.push(permission);
  });

  const searchValueChanged = (event: any, value?: string): void => {
    let filteredPermissions = scopes.data;
    if (value) {
      const keyword = value.toLowerCase();

      filteredPermissions = scopes.data.filter((permission: IPermission) => {
        const name = permission.value.toLowerCase();
        return name.includes(keyword);
      });
    }
    setPermissions(filteredPermissions);
  };

  const groups = generateGroupsFromList(permissionsList, 'groupName');

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
      <Announced message={`${permissions.length} search results available.`} />
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
      {permissions && permissions.length === 0 &&
        <Label style={{
          display: 'flex',
          width: '100%',
          minHeight: '200px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <FormattedMessage id='permissions not found' />
        </Label>
      }
    </>
  );
};
export default PanelList;