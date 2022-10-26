import {
  FontSizes,
  getId,
  getTheme,
  IColumn,
  Label,
  PrimaryButton,
  TooltipHost
} from '@fluentui/react';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { IPermission, IPermissionGrant, IPermissionProps } from '../../../../../types/permissions';
import { IRootState } from '../../../../../types/root';
import * as permissionActionCreators from '../../../../services/actions/permissions-action-creator';
import { translateMessage } from '../../../../utils/translate-messages';
import { classNames } from '../../../classnames';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';
import PanelList from './PanelList';
import { permissionStyles } from './Permission.styles';
import TabList from './TabList';
import messages from '../../../../../messages';
import { REVOKING_PERMISSIONS_REQUIRED_SCOPES } from '../../../../services/graph-constants';

export const Permission = ( permissionProps?: IPermissionProps ) : JSX.Element => {

  const { sampleQuery, scopes, dimensions, authToken, consentedScopes } =
  useSelector( (state: IRootState) => state );
  const { pending: loading } = scopes;
  const tokenPresent = !!authToken.token;
  const dispatch = useDispatch();
  const panel = permissionProps?.panel;

  const classProps = {
    styles: permissionProps!.styles,
    theme: permissionProps!.theme
  };

  const classes = classNames(classProps);
  const theme = getTheme();
  const panelStyles = permissionStyles(theme).panelContainer;
  const tabHeight = convertVhToPx(dimensions.request.height, 110);


  const getPermissions = () : void => {
    dispatch(permissionActionCreators.fetchScopes());
  }

  useEffect(() => {
    console.log('Dispatching this')
    dispatch(permissionActionCreators.fetchAllPrincipalGrants());
  }, [])

  useEffect(() => {
    getPermissions();
  },[sampleQuery]);

  const handleConsent = async (permission: IPermission) : Promise<void> => {
    const consentScopes = [permission.value];
    dispatch(permissionActionCreators.consentToScopes(consentScopes));
  };

  const handleRevoke = async (permission: IPermission) : Promise<void> => {
    dispatch(permissionActionCreators.revokeScopes(permission.value));
  };

  const renderItemColumn = (item: any, index: any, column: IColumn | undefined) => {
    const hostId: string = getId('tooltipHost');
    const consented = !!item.consented;

    if (column) {
      const content = item[column.fieldName as keyof any] as string;

      switch (column.key) {

        case 'isAdmin':
          if (item.isAdmin) {
            return <div style={{ textAlign: 'center' }}>
              <Label><FormattedMessage id='Yes' /></Label>
            </div>;
          } else {
            return <div style={{ textAlign: 'center' }}>
              <Label><FormattedMessage id='No' /></Label>
            </div>;
          }

        case 'consented':
          if (consented) {
            if(userHasRequiredPermissions()){
              return <PrimaryButton onClick={() => handleRevoke(item)} style={{width: '80px'}}>
                <FormattedMessage id='Revoke' />
              </PrimaryButton>;
            }
            else{
              return <TooltipHost
                content={translateMessage('You require the following permissions to revoke')}
                id={hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <PrimaryButton disabled={true} onClick={() => handleConsent(item)} style={{width: '80px'}}>
                  <FormattedMessage id='Unconsent' />
                </PrimaryButton>
              </TooltipHost>;
            }
          } else {
            return <PrimaryButton onClick={() => handleConsent(item)} style={{width: '80px'}}>
              <FormattedMessage id='Consent' />
            </PrimaryButton>;
          }

        case 'consentDescription':
          return <>
            <TooltipHost
              content={item.consentDescription}
              id={hostId}
              calloutProps={{ gapSpace: 0 }}
              styles={{
                root: { display: 'block' }
              }}
            >
              <span aria-labelledby={hostId}>
                {item.consentDescription}
              </span>
            </TooltipHost>
          </>;

        case 'consentType':
          if(scopes && scopes.data.tenantWidePermissionsGrant && scopes.data.tenantWidePermissionsGrant.length > 0
             && consented) {

            const tenantWideGrant : IPermissionGrant[] = scopes.data.tenantWidePermissionsGrant;
            const allPrincipalPermissions = getAllPrincipalPermissions(tenantWideGrant);
            const permissionInAllPrincipal = allPrincipalPermissions.some((permission: string) =>
              item.value === permission);

            if(permissionInAllPrincipal){
              return <div style={{ textAlign: 'center' }}>
                <Label>{translateMessage('AllPrincipal')}</Label>
              </div>
            }
            else{
              return <div style={{ textAlign: 'center' }}>
                <Label>{translateMessage('Principal')}</Label>
              </div>
            }
          }

        default:
          return (
            <TooltipHost
              content={content}
              id={hostId}
              calloutProps={{ gapSpace: 0 }}
              className={classes.tooltipHost}
            >
              <span aria-labelledby={hostId} style={{ fontSize: FontSizes.medium }}>
                {content}
              </span>
            </TooltipHost>
          );
      }
    }
  };

  const getAllPrincipalPermissions = (tenantWidePermissionsGrant: IPermissionGrant[]): string[] => {
    const allPrincipalPermissions = tenantWidePermissionsGrant.find((permission: any) =>
      permission.consentType.toLowerCase() === 'AllPrincipals'.toLowerCase());
    return allPrincipalPermissions ? allPrincipalPermissions.scope.split(' ') : [];
  }

  const userHasRequiredPermissions = () : boolean => {
    if(scopes && scopes.data.tenantWidePermissionsGrant && scopes.data.tenantWidePermissionsGrant.length > 0) {
      const allPrincipalPermissions = getAllPrincipalPermissions(scopes.data.tenantWidePermissionsGrant);
      const principalAndAllPrincipalPermissions = [...allPrincipalPermissions, ...consentedScopes];
      const requiredPermissions = REVOKING_PERMISSIONS_REQUIRED_SCOPES.split(' ');
      return requiredPermissions.every(scope => principalAndAllPrincipalPermissions.includes(scope));
    }
    return false;
  }

  const renderDetailsHeader = (props: any, defaultRender?: any) => {
    return defaultRender!({
      ...props,
      onRenderColumnHeaderTooltip: (tooltipHostProps: any) => {
        return (
          <TooltipHost {...tooltipHostProps} />
        );
      }
    });
  }

  const getColumnCellStyles = () => {
    return {
      cellName: {
        overflow: 'visible !important' as 'visible',
        wordBreak: 'break-word',
        overflowWrap: 'break-word'
      }
    }
  }

  const getColumns = () : IColumn[] => {
    const columns: IColumn[] = [
      {
        key: 'value',
        name: translateMessage('Permission'),
        fieldName: 'value',
        minWidth: 200,
        maxWidth: 250,
        isResizable: true,
        columnActionsMode: 0
      }
    ];

    if (!panel) {
      columns.push(
        {
          key: 'consentDescription',
          name: translateMessage('Description'),
          fieldName: 'consentDescription',
          isResizable: true,
          minWidth: (tokenPresent) ? 100 : 600,
          maxWidth: (tokenPresent) ? 300 : 1000,
          isMultiline: true,
          columnActionsMode: 0
        }
      );
    }

    columns.push(
      {
        key: 'isAdmin',
        isResizable: true,
        name: translateMessage('Admin consent required'),
        fieldName: 'isAdmin',
        minWidth: (tokenPresent) ? 150 : 200,
        maxWidth: (tokenPresent) ? 250 : 300,
        ariaLabel: translateMessage('Administrator permission'),
        columnActionsMode: 0,
        isMultiline: true,
        headerClassName: 'permissionHeader',
        styles: getColumnCellStyles()
      }
    );

    if (tokenPresent) {
      columns.push(
        {
          key: 'consented',
          name: translateMessage('Status'),
          isResizable: false,
          fieldName: 'consented',
          minWidth: 100,
          maxWidth: 100
        },

      );
    }
    if(scopes && scopes.data.tenantWidePermissionsGrant && scopes.data.tenantWidePermissionsGrant.length > 0){
      columns.push(
        {
          key: 'consentType',
          name: translateMessage('Consent type'),
          isResizable: false,
          fieldName: 'consentType',
          minWidth: 100,
          maxWidth: 100
        }
      )
    }
    return columns;
  }

  const displayPermissionsPanel = () : JSX.Element => {
    return <div data-is-scrollable={true} style={panelStyles}>
      <PanelList
        classes={classes}
        messages={messages}
        columns={getColumns()}
        renderItemColumn={(item?: any, index?: number, column?: IColumn) =>
          renderItemColumn(item, index, column)}
        renderDetailsHeader={renderDetailsHeader}
      />
    </div>
  };

  const displayPermissionsAsTab = () : JSX.Element => {
    if (loading.isSpecificPermissions) {
      return displayLoadingPermissionsText();
    }

    return <TabList
      columns={getColumns()}
      maxHeight={tabHeight}
      renderItemColumn={(item?: any, index?: number, column?: IColumn) =>
        renderItemColumn(item, index, column)}
      renderDetailsHeader={renderDetailsHeader}
      classes={classes}
    />;
  };

  const displayLoadingPermissionsText = () => {
    return (
      <Label style={{marginLeft: '12px'}}>
        <FormattedMessage id={'Fetching permissions'} />...
      </Label>
    );
  }

  return(
    <>
      {panel ? displayPermissionsPanel() : displayPermissionsAsTab()}
    </>
  );
}