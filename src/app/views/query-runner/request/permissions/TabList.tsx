import { DetailsList, DetailsListLayoutMode, IColumn, Label, SelectionMode } from 'office-ui-fabric-react';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { IPermission } from '../../../../../types/permissions';

import { setConsentedStatus } from './util';

interface ITabList {
  columns: any[];
  classes: any;
  renderItemColumn: Function;
  renderDetailsHeader: Function;
  maxHeight: string;
}

const TabList = ({ columns, classes, renderItemColumn, renderDetailsHeader, maxHeight }: ITabList) => {
  const { consentedScopes, scopes, authToken } = useSelector((state: any) => state);
  const permissions: IPermission[] = scopes.hasUrl ? scopes.data : [];
  const tokenPresent = !!authToken;

  useEffect(() => {
    setConsentedStatus(tokenPresent, permissions, consentedScopes);
  }, [scopes.data, consentedScopes]);

  if (tokenPresent && !scopes.hasUrl) {
    return displayNoPermissionsFoundMessage();
  }
  if (!tokenPresent && !scopes.hasUrl) {
    return displayNotSignedInMessage();
  }

  return (
    <>
      <Label className={classes.permissionLength}>
        <FormattedMessage id='Permissions' />&nbsp;({permissions.length})
      </Label>
      <Label className={classes.permissionText}>
        {!tokenPresent && <FormattedMessage id='sign in to consent to permissions' />}
        {tokenPresent && <FormattedMessage id='permissions required to run the query' />}
      </Label>
      <DetailsList styles={{ root: { maxHeight } }}
        items={permissions}
        columns={columns}
        onRenderItemColumn={(item?: any, index?: number, column?: IColumn) => renderItemColumn(item, index, column)}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        onRenderDetailsHeader={(props?: any, defaultRender?: any) => renderDetailsHeader(props, defaultRender)} />
      {permissions && permissions.length === 0 &&
        displayNoPermissionsFoundMessage()
      }
    </>
  );
};

export default TabList;

function displayNoPermissionsFoundMessage() {
  return (<Label style={{
    display: 'flex',
    paddingLeft: '10px',
    paddingRight: '10px',
    width: '100%',
    minHeight: '200px',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <FormattedMessage id='permissions not found in permissions tab' />
  </Label>);
}

function displayNotSignedInMessage() {
  return (<Label style={{
    display: 'flex',
    paddingLeft: '10px',
    paddingRight: '10px',
    width: '100%',
    minHeight: '200px',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <FormattedMessage id='sign in to view a list of all permissions' />
  </Label>)
}
