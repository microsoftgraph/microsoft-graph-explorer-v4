import {
  DetailsList,
  DetailsListLayoutMode,
  getId,
  IColumn,
  Icon,
  Label,
  PrimaryButton,
  SelectionMode,
  styled,
  TooltipHost,
  Checkbox
} from 'office-ui-fabric-react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getAuthTokenSuccess, getConsentedScopesSuccess } from '../../../../services/actions/auth-action-creators';
import { acquireNewAccessToken } from '../../../../services/graph-client/msal-service';
import { classNames } from '../../../classnames';
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
  const {
    panel,
    intl: { messages },
  }: any = props;

  const panelView = !!panel;

  const columns = [{
    key: 'value',
    name: messages.Permission,
    fieldName: 'value',
    minWidth: 100,
    maxWidth: 150,
    isResizable: true
  }
  ];

  if (!panelView) {

    columns.push({
      key: 'consentDisplayName',
      name: messages['Display string'],
      fieldName: 'consentDisplayName',
      isResizable: true,
      minWidth: 150,
      maxWidth: 200
    },{
      key: 'consentDescription',
      name: messages.Description,
      fieldName: 'consentDescription',
      isResizable: true,
      minWidth: 200,
      maxWidth: 300
    });
  }

  columns.push({
    key: 'isAdmin',
    isResizable: false,
    name: messages['Admin consent required'],
    fieldName: 'isAdmin',
    minWidth: 100,
    maxWidth: 200
  });

  if (accessToken) {
    columns.push(
      {
        key: 'consented',
        name: messages.Status,
        isResizable: false,
        fieldName: 'consented',
        minWidth: 100,
        maxWidth: 200
      });
  }

  if (panelView) {
    columns.unshift({
      key: 'checkbox',
      name: '',
      fieldName: '',
      isResizable: true,
      minWidth: 20,
      maxWidth: 30
    });
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
          return <Checkbox disabled={consented} />;

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
          return content;
      }
    }
  };

  return (
    <div className={classes.container} style={{ minHeight: (panelView) ? '800px' : '350px' }}>
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

const IntlPermission = injectIntl(Permission);
export default styled(IntlPermission, permissionStyles as any);
