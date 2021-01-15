import { DetailsList, DetailsListLayoutMode, IColumn, Label, SelectionMode } from 'office-ui-fabric-react';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { setConsentedStatus } from './util';

interface ITabList {
  columns: any[];
  classes: any;
  renderItemColumn: Function;
  renderDetailsHeader: Function;
}


const TabList = ({ columns, classes, renderItemColumn, renderDetailsHeader }: ITabList) => {
  let permissions: any[] = [];
  const { consentedScopes, scopes, tokenPresent } = useSelector((state: any) => state);

  if (scopes.hasUrl) {
    permissions = scopes.data;
  }
  useEffect(() => {
    setConsentedStatus(tokenPresent, permissions, consentedScopes);
  }, [scopes.data, consentedScopes]);

  if (!scopes.hasUrl) {
    return displayNoPermissionsFoundMessage();
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
      <DetailsList styles={{ root: { minHeight: '300px' } }}
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
    width: '100%',
    minHeight: '200px',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <FormattedMessage id='permissions not found' />
  </Label>);
}
