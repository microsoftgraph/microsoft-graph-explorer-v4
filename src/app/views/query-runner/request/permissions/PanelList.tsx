import {
  Announced,
  DetailsList,
  DetailsListLayoutMode,
  GroupHeader,
  IColumn,
  Label,
  SearchBox,
  SelectionMode
} from '@fluentui/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { SortOrder } from '../../../../../types/enums';
import { IPermission } from '../../../../../types/permissions';
import { IRootState } from '../../../../../types/root';
import { dynamicSort } from '../../../../utils/dynamic-sort';
import { generateGroupsFromList } from '../../../../utils/generate-groups';
import { searchBoxStyles } from '../../../../utils/searchbox.styles';
import { setConsentedStatus } from './util';

interface IPanelList {
  messages: any;
  columns: any[];
  classes: any;
  selection: any;
  renderItemColumn: any;
  renderDetailsHeader: Function;
  renderCustomCheckbox: Function;
}

const PanelList = ({ messages,
  columns, classes, selection,
  renderItemColumn, renderDetailsHeader, renderCustomCheckbox }: IPanelList) => {

  const { consentedScopes, scopes, authToken } = useSelector((state: IRootState) => state);
  const { panelPermissions } = scopes.data;
  const [permissions, setPermissions] = useState(panelPermissions.sort(dynamicSort('value', SortOrder.ASC)));
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
    let filteredPermissions = scopes.data.panelPermissions;
    if (value) {
      const keyword = value.toLowerCase();

      filteredPermissions = panelPermissions.filter((permission: IPermission) => {
        const name = permission.value.toLowerCase();
        return name.includes(keyword);
      });
    }
    setPermissions(filteredPermissions);
  };

  const groups = generateGroupsFromList(permissionsList, 'groupName');


  const _onRenderGroupHeader = (props: any): any => {
    if (props) {
      return (
        <GroupHeader  {...props} onRenderGroupHeaderCheckbox={renderCustomCheckbox} />
      )
    }
    return null;
  };

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
        styles={searchBoxStyles}
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
          onRenderHeader: _onRenderGroupHeader
        }}
        ariaLabelForSelectionColumn={messages['Toggle selection'] || 'Toggle selection'}
        ariaLabelForSelectAllCheckbox={messages['Toggle selection for all items'] || 'Toggle selection for all items'}
        checkButtonAriaLabel={messages['Row checkbox'] || 'Row checkbox'}
        onRenderDetailsHeader={(props?: any, defaultRender?: any) => renderDetailsHeader(props, defaultRender)}
        onRenderCheckbox={(props: any) => renderCustomCheckbox(props)}
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