import {
  DefaultButton,
  FontSizes,
  getId,
  getTheme,
  IColumn,
  IconButton,
  IIconProps,
  Label,
  PrimaryButton,
  TooltipHost
} from '@fluentui/react';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { IPermission,IPermissionGrant, IPermissionProps } from '../../../../../types/permissions';
import { consentToScopes, fetchScopes, revokeScopes, fetchAllPrincipalGrants } from
  '../../../../services/actions/permissions-action-creator';
import { translateMessage } from '../../../../utils/translate-messages';
import { classNames } from '../../../classnames';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';
import PanelList from './PanelList';
import { permissionStyles } from './Permission.styles';
import TabList from './TabList';
import messages from '../../../../../messages';
import { ADMIN_CONSENT_DOC_LINK, CONSENT_TYPE_DOC_LINK,
  REVOKING_PERMISSIONS_REQUIRED_SCOPES } from '../../../../services/graph-constants';
import { styles } from '../../query-input/auto-complete/suffix/suffix.styles';
import { setDescriptionColumnSize } from './util';
import { componentNames, telemetry } from '../../../../../telemetry';

export const Permission = (permissionProps?: IPermissionProps): JSX.Element => {

  const { sampleQuery, scopes, dimensions, authToken, consentedScopes } =
    useAppSelector((state) => state);
  const { pending: loading } = scopes;
  const tokenPresent = !!authToken.token;
  const dispatch: AppDispatch = useDispatch();
  const panel = permissionProps?.panel;

  const classProps = {
    styles: permissionProps!.styles,
    theme: permissionProps!.theme
  };

  const classes = classNames(classProps);
  const theme = getTheme();
  const {panelContainer: panelStyles, tooltipStyles, columnCellStyles, cellTitleStyles,
    detailsHeaderStyles} = permissionStyles(theme);
  const tabHeight = convertVhToPx(dimensions.request.height, 110);

  const getPermissions = (): void => {
    dispatch(fetchScopes());
  }

  useEffect(() => {
    dispatch(fetchAllPrincipalGrants());
  }, [])

  useEffect(() => {
    getPermissions();
  },[sampleQuery]);

  const handleConsent = async (permission: IPermission): Promise<void> => {
    const consentScopes = [permission.value];
    dispatch(consentToScopes(consentScopes));
  };

  const handleRevoke = async (permission: IPermission) : Promise<void> => {
    dispatch(revokeScopes(permission.value));
  };

  const buttonIcon: IIconProps = {
    iconName: 'Info',
    style: {
      position: 'relative',
      top: '1px',
      left: '6px'
    } };

  const renderItemColumn = (item: any, index: any, column: IColumn | undefined) => {
    const hostId: string = getId('tooltipHost');
    const consented = !!item.consented;

    if (column) {
      const content = item[column.fieldName as keyof any] as string;

      switch (column.key) {

        case 'isAdmin':
          return adminLabel(item);

        case 'consented':
          return consentedButton(consented, item, hostId);

        case 'consentDescription':
          return consentDescriptionJSX(item, hostId);

        case 'consentType':
          return consentTypeProperty(consented, item);

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

  const consentDescriptionJSX = (item: any, hostId: string) => {
    return(
      <>
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
        </TooltipHost></>
    )
  }

  const adminLabel = (item: any): JSX.Element => {
    if (item.isAdmin) {
      return <div style={{ textAlign: 'left', paddingLeft:'10px' }}>
        <Label><FormattedMessage id='Yes' /></Label>
      </div>;
    } else {
      return <div style={{ textAlign: 'left', paddingLeft: '10px' }}>
        <Label><FormattedMessage id='No' /></Label>
      </div>;
    }
  }

  const consentedButton = (consented: boolean, item: any, hostId: string): JSX.Element => {
    if (consented) {
      if(userHasRequiredPermissions()){
        return <PrimaryButton onClick={() => handleRevoke(item)} style={{width: '100px', textAlign:'left'}}>
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
          <DefaultButton
            toggle
            checked={false}
            text={translateMessage('Revoke')}
            iconProps={buttonIcon}
            allowDisabledFocus
            disabled={true}
            style={{width: '100px'}}
          />
        </TooltipHost>;
      }
    } else {
      return <PrimaryButton onClick={() => handleConsent(item)} style={{width: '100px'}}>
        <FormattedMessage id='Consent' />
      </PrimaryButton>;
    }
  }

  const consentTypeProperty = (consented: boolean, item: any): JSX.Element => {
    if(scopes && scopes.data.tenantWidePermissionsGrant && scopes.data.tenantWidePermissionsGrant.length > 0
             && consented) {

      const tenantWideGrant : IPermissionGrant[] = scopes.data.tenantWidePermissionsGrant;
      const allPrincipalPermissions = getAllPrincipalPermissions(tenantWideGrant);
      const permissionInAllPrincipal = allPrincipalPermissions.some((permission: string) =>
        item.value === permission);
      return permissionConsentTypeLabel(permissionInAllPrincipal);
    }
    return <div/>
  }

  const permissionConsentTypeLabel = (permissionInAllPrincipal : boolean) : JSX.Element => {
    if(permissionInAllPrincipal){
      return (
        <div style={{textAlign: 'left', paddingLeft: '10px'}}>
          <Label>{translateMessage('AllPrincipal')}</Label>
        </div>
      )
    }
    else{
      return (
        <div style={{textAlign: 'left', paddingLeft: '10px'}}>
          <Label>{translateMessage('Principal')}</Label>
        </div>
      )
    }
  }

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
          <TooltipHost {...tooltipHostProps} styles={tooltipStyles} />
        );
      },
      styles: detailsHeaderStyles
    });
  }

  const getColumns = () : IColumn[] => {
    const columnSizes = setDescriptionColumnSize();
    const columns: IColumn[] = [
      {
        key: 'value',
        name: translateMessage('Permission'),
        fieldName: 'value',
        minWidth: 150,
        maxWidth: 200,
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
          minWidth: (tokenPresent) ? columnSizes.minWidth : 600,
          maxWidth: (tokenPresent) ? columnSizes.maxWidth : 750,
          isMultiline: true,
          columnActionsMode: 0
        }
      );
    }

    columns.push(
      {
        key: 'isAdmin',
        name: translateMessage('Admin consent required'),
        fieldName: 'isAdmin',
        minWidth:  150,
        maxWidth:  200,
        ariaLabel: translateMessage('Administrator permission'),
        isMultiline: true,
        headerClassName: 'permissionHeader',
        styles: columnCellStyles,
        onRenderHeader: () => renderColumnHeader('Admin consent required')
      }
    );

    if (tokenPresent) {
      columns.push(
        {
          key: 'consented',
          name: translateMessage('Status'),
          isResizable: false,
          fieldName: 'consented',
          minWidth: 90,
          maxWidth: 100,
          onRenderHeader: () => renderColumnHeader('Status'),
          styles: columnCellStyles
        },

      );
    }
    columns.push(
      {
        key: 'consentType',
        name: translateMessage('Consent type'),
        isResizable: false,
        fieldName: 'consentType',
        minWidth: 110,
        maxWidth: 120,
        onRenderHeader: () => renderColumnHeader('Consent type'),
        styles: columnCellStyles,
        ariaLabel: translateMessage('Permission consent type')
      }
    )
    return columns;
  }

  const infoIcon: IIconProps = {
    iconName: 'Info',
    styles: cellTitleStyles
  };

  const openExternalWebsite = (url: string) => {
    switch(url){
      case 'Consent type':
        window.open(CONSENT_TYPE_DOC_LINK, '_blank');
        trackLinkClickedEvent(CONSENT_TYPE_DOC_LINK, componentNames.CONSENT_TYPE_DOC_LINK)
        break;
      case 'Admin consent required':
        window.open(ADMIN_CONSENT_DOC_LINK, '_blank');
        trackLinkClickedEvent(ADMIN_CONSENT_DOC_LINK, componentNames.ADMIN_CONSENT_DOC_LINK);
        break;
    }
  }

  const trackLinkClickedEvent = (link: string, componentName: string) => {
    telemetry.trackLinkClickEvent(link, componentName);
  }


  const renderColumnHeader = (headerText: string) => {
    if(headerText === 'Status'){
      return (
        <span style={{position: 'relative', top: '2px', left: '2px', flex:1}}>
          {translateMessage('Status')}
        </span>
      )
    }

    return (<div style={{ textAlign: 'left', display: 'flex'}}>
      <IconButton
        iconProps={infoIcon}
        className={styles.iconButton}
        id={'buttonId'}
        ariaLabel={translateMessage(headerText)}
        onClick={() => openExternalWebsite(headerText)}
        styles={{root: { position: 'relative', right: '1px'}}}
      >
      </IconButton>
      <span style={{paddingTop: '4px' }}>
        {translateMessage(headerText)}
      </span>
    </div>)
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

  const displayPermissionsAsTab = (): JSX.Element => {
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

  return (
    <>
      {panel ? displayPermissionsPanel() : displayPermissionsAsTab()}
    </>
  );
}