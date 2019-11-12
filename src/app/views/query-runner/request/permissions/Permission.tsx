import {
  DetailsList,
  DetailsListLayoutMode,
  getId,
  IColumn,
  Label,
  PrimaryButton,
  SelectionMode,
  styled,
  TooltipHost
} from 'office-ui-fabric-react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { getAuthTokenSuccess, getConsentedScopesSuccess } from '../../../../services/actions/auth-action-creators';
import { acquireNewAccessToken } from '../../../../services/graph-client/MsalService';
import { classNames } from '../../../classnames';
import { Monaco } from '../../../common';
import { permissionStyles } from './Permission.styles';
import { fetchScopes } from './util';

export interface IPermission {
  value: string;
  consentDisplayName: string;
  consentDescription: string;
  isAdmin: boolean;
  consented: boolean;
}

function Permission(props: any) {
  const sample = useSelector((state: any) => state.sampleQuery, shallowEqual);
  const accessToken = useSelector((state: any) => state.authToken);
  const dispatch = useDispatch();
  const consentedScopes: string[] = useSelector((state: any) => state.consentedScopes);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: 'value', name: 'Name', fieldName: 'value', minWidth: 100, maxWidth: 150 },
    {
      key: 'consentDisplayName', name: 'Function', fieldName: 'consentDisplayName', isResizable: true,
      minWidth: 150, maxWidth: 200
    },
    {
      key: 'consentDescription', name: 'Description', fieldName: 'consentDescription', isResizable: true,
      minWidth: 200, maxWidth: 300
    },
    { key: 'isAdmin', name: 'Admin Consent', fieldName: 'isAdmin', minWidth: 100, maxWidth: 200 }
  ];

  if (accessToken) {
    columns.push(
      { key: 'consented', name: 'Status', fieldName: 'consented', minWidth: 100, maxWidth: 200 }
    );
  }

  const classes = classNames(props);

  useEffect(() => {
    setLoading(true);
    setPermissions([]);

    fetchScopes(sample)
      .then(res => { setLoading(false); setPermissions(res); })
      .catch(() => {
        setLoading(false);
        setPermissions([]);
      });
  }, [sample.sampleUrl, sample.selectedVerb]);

  if (accessToken) {
    permissions.forEach((permission: IPermission) => {
      if (consentedScopes.indexOf(permission.value) !== -1) {
        permission.consented = true;
      }
    });
  }

  const handleConsent = async (permission: IPermission) => {
    const scope = [permission.value];
    const authResponse = await acquireNewAccessToken(scope);

    if (authResponse && authResponse.accessToken) {
      dispatch(getAuthTokenSuccess(authResponse.accessToken));
      dispatch(getConsentedScopesSuccess(authResponse.scopes));
    }
  };

  const renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    const hostId: string = getId('tooltipHost');

    if (column) {
      const content = item[column.fieldName as keyof any] as string;

      switch (column.key) {

        case 'isAdmin':
          if (item.isAdmin) {
            return 'True';
          } else {
            return 'False';
          }

        case 'consented':
          const consented = !!item.consented;
          if (consented) {
            return <Label className={classes.consented}
            ><FormattedMessage id='Consented' /></Label>;
          } else {
            return <PrimaryButton onClick={() => handleConsent(item)}>
              <FormattedMessage id='Consent' />
            </PrimaryButton>;
          }

        case 'consentDescription':
          return <>
            <TooltipHost
              content={item.consentDescription}
              id={hostId}
              calloutProps={{ gapSpace: 0 }}
              className={classes.tooltipHost}
            >
              <span aria-labelledby={hostId}>
                {item.consentDescription}
              </span>
            </TooltipHost>
          </>
            ;

        default:
          return content;
      }
    }
  };

  return (
    <div className={classes.container}>
      {loading && <Monaco body={'Fetching permissions...'} />}
      {permissions && !loading &&
        <div className={classes.permissions}>
          <Label className={classes.permissionLength}>
            <FormattedMessage id='Permissions' />&nbsp;({permissions.length})
          </Label>
          <DetailsList
            items={permissions}
            columns={columns}
            onRenderItemColumn={renderItemColumn}
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.justified}
          />
        </div>
      }
    </div>
  );
}

export default styled(Permission, permissionStyles as any);
