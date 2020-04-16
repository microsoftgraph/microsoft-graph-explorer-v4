import {
  Checkbox,
  DetailsList,
  DetailsListLayoutMode,
  getId,
  IColumn,
  Icon,
  Label,
  PrimaryButton,
  SelectionMode,
  styled,
  TooltipHost
} from 'office-ui-fabric-react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { consentToScopes, fetchScopes } from '../../../../services/actions/permissions-action-creator';
import { classNames } from '../../../classnames';
import { permissionStyles } from './Permission.styles';

export interface IPermission {
  value: string;
  consentDisplayName: string;
  consentDescription: string;
  isAdmin: boolean;
  consented: boolean;
}

function Permission(props: any) {
  const { accessToken, sample, scopes } = useSelector(
    (state: any) => ({
      sample: state.sampleQuery,
      scopes: state.scopes,
      accessToken: state.authToken
    })
  );

  const dispatch = useDispatch();
  const consentedScopes: string[] = useSelector((state: any) => state.consentedScopes);
  const [permissionsToConsent, selectPermissions] = useState<string[]>([]);
  const { data: permissions, pending: loading } = scopes;

  const {
    panel,
    intl: { messages },
  }: any = props;

  const panelView = !!panel;
  const columns = getColumns(messages, panelView, accessToken);
  const classes = classNames(props);

  useEffect(() => {
    if (panelView) {
      dispatch(fetchScopes());
    } else {
      dispatch(fetchScopes(sample));
    }
  }, [sample.sampleUrl, sample.selectedVerb]);

  if (accessToken && permissions.length > 0) {
    permissions.forEach((permission: IPermission) => {
      if (consentedScopes.indexOf(permission.value) !== -1) {
        permission.consented = true;
      }
    });
  }

  const handleConsent = async (permission?: IPermission) => {
    let consentScopes = [];
    if (permission) {
      consentScopes.push(permission.value);
    } else {
      consentScopes = permissionsToConsent;
    }
    dispatch(consentToScopes(consentScopes));
  };

  const handlePermissionCheckboxChanged = (permission: IPermission) => {
    const index = permissionsToConsent.indexOf(permission.value);
    let selected = [...permissionsToConsent];
    if (index !== -1) {
      selected = permissionsToConsent.filter(item => item !== permission.value);
    } else {
      selected.push(permission.value);
    }
    selectPermissions(selected);
    props.setPermissions(selected);
  };

  const renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    const hostId: string = getId('tooltipHost');
    const consented = !!item.consented;
    if (column) {
      const content = item[column.fieldName as keyof any] as string;

      switch (column.key) {

        case 'isAdmin':
          if (item.isAdmin) {
            return <div style={{ textAlign: 'center' }}>
              <Icon iconName='checkmark' className={classes.checkIcon} />
            </div>;
          } else {
            return <div style={{ textAlign: 'center' }}>
              <Icon iconName='StatusCircleErrorX' className={classes.checkIcon} />
            </div>;
          }

        case 'checkbox':
          return <Checkbox disabled={consented} onChange={() => handlePermissionCheckboxChanged(item)} />;

        case 'consented':
          if (consented) {
            return <Label className={classes.consented}
            ><FormattedMessage id='Consented' /></Label>;
          } else {
            if (!panelView) {
              return <PrimaryButton onClick={() => handleConsent(item)}>
                <FormattedMessage id='Consent' />
              </PrimaryButton>;
            }
            return null;
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
          return (
            <TooltipHost
              content={item.consentDescription}
              id={hostId}
              calloutProps={{ gapSpace: 0 }}
              className={classes.tooltipHost}
            >
              <span aria-labelledby={hostId}>
                {content}
              </span>
            </TooltipHost>
          );
      }
    }
  };

  return (
    <div className={classes.container}  style={{ minHeight: (panelView) ? '800px' : '300px' }}>
      {loading && <Label>
        <FormattedMessage id={'Fetching permissions'} />...
      </Label>}
      {permissions && !loading &&
        <div className={classes.permissions}>
          {!panelView && <><Label className={classes.permissionLength}>
            <FormattedMessage id='Permissions' />&nbsp;({permissions.length})
          </Label>
            <Label className={classes.permissionText}>
              <FormattedMessage id='permissions required to run the query' />
            </Label></>}
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

function getColumns(messages: any, panelView: boolean, accessToken: any) {
  const columns = [
    {
      key: 'value',
      name: messages.Permission,
      fieldName: 'value',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true
    }
  ];

  if (!panelView) {
    columns.push(
      {
        key: 'consentDisplayName',
        name: messages['Display string'],
        fieldName: 'consentDisplayName',
        isResizable: true,
        minWidth: 150,
        maxWidth: 200
      },
      {
        key: 'consentDescription',
        name: messages.Description,
        fieldName: 'consentDescription',
        isResizable: true,
        minWidth: 200,
        maxWidth: 300
      }
    );
  }

  columns.push(
    {
      key: 'isAdmin',
      isResizable: true,
      name: messages['Admin consent required'],
      fieldName: 'isAdmin',
      minWidth: 100,
      maxWidth: 200
    }
  );

  if (accessToken) {
    columns.push(
      {
        key: 'consented',
        name: messages.Status,
        isResizable: false,
        fieldName: 'consented',
        minWidth: 100,
        maxWidth: 200
      }
    );
  }

  if (panelView) {
    columns.unshift(
      {
        key: 'checkbox',
        name: '',
        fieldName: '',
        isResizable: true,
        minWidth: 20,
        maxWidth: 30
      }
    );
  }

  return columns;
}

const IntlPermission = injectIntl(Permission);
export default styled(IntlPermission, permissionStyles as any);
